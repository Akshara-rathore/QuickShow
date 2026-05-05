import express from 'express';
import Stripe from 'stripe';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import User from '../models/User.js';
import { inngest } from '../inngest/client.js';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// helper: find user or create automatically
const findOrCreateUser = async (clerkId, userData = {}) => {
  let user = await User.findOne({ clerkId });

  if (!user) {
    user = await User.create({
      clerkId,
      name: userData.name || 'User',
      email: userData.email || `${clerkId}@quickshow.local`,
      image: userData.image || '',
    });
  }

  return user;
};

// ================= CREATE BOOKING =================
router.post('/create', async (req, res) => {
  try {
    const { clerkId, showId, seats, name, email, image } = req.body;

    if (!clerkId || !showId || !seats || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const user = await findOrCreateUser(clerkId, { name, email, image });

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    let amount = 0;
    const lineItems = [];
    const groupedByTier = {};

    for (const seat of seats) {
      if (show.occupiedSeats?.get(seat)) {
        return res.status(400).json({
          success: false,
          message: `Seat ${seat} already booked`,
        });
      }

      // Calculate tier based on row
      const rowLetter = seat.charAt(0);
      const tier = show.seatTiers?.find(t => t.rows.includes(rowLetter)) || { name: 'Standard', price: show.showPrice };
      
      amount += tier.price;

      if (!groupedByTier[tier.name]) {
        groupedByTier[tier.name] = { price: tier.price, count: 0, seats: [] };
      }
      groupedByTier[tier.name].count += 1;
      groupedByTier[tier.name].seats.push(seat);
    }

    const booking = new Booking({
      user: user._id,
      show: show._id,
      amount,
      bookedSeats: seats,
      status: 'pending',
    });

    await booking.save();

    for (const seat of seats) {
      show.occupiedSeats.set(seat, user._id.toString());
    }
    await show.save();

    try {
      await inngest.send({
        name: 'booking/payment.timeout',
        data: {
          bookingId: booking._id.toString(),
          showId: show._id.toString(),
          seats,
        },
      });
    } catch (inngestErr) {
      console.log('Inngest error (non-fatal):', inngestErr.message);
    }

    for (const [tierName, data] of Object.entries(groupedByTier)) {
      lineItems.push({
        price_data: {
          currency: 'inr',
          product_data: {
            name: `${tierName} Tickets - ${show.movie?.title || 'Movie'}`,
            description: `Seats: ${data.seats.join(', ')}`,
          },
          unit_amount: data.price * 100,
        },
        quantity: data.count,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `http://localhost:5173/my-booking?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/seat-layout/${showId}`,
      metadata: {
        bookingId: booking._id.toString(),
      },
    });

    booking.stripeSessionId = session.id;
    await booking.save();

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.log('CREATE BOOKING ERROR:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ================= GET USER BOOKINGS =================
router.get('/my-bookings', async (req, res) => {
  try {
    const { clerkId } = req.query;

    if (!clerkId) {
      return res.status(400).json({
        success: false,
        message: 'clerkId is required',
      });
    }

    const user = await findOrCreateUser(clerkId);

    const bookings = await Booking.find({ user: user._id })
      .populate('show')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.log('GET BOOKINGS ERROR:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ================= GET ALL BOOKINGS (ADMIN) =================
router.get('/all', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('show')
      .populate('user')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.log('GET ALL BOOKINGS ERROR:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ================= VERIFY STRIPE SESSION =================
router.post('/verify', async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'sessionId is required' });
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid') {
      const bookingId = session.metadata.bookingId;
      const booking = await Booking.findById(bookingId);
      
      if (booking && booking.status === 'pending') {
        booking.status = 'paid';
        await booking.save();
        
        // Trigger email notification via Inngest
        try {
          await inngest.send({
            name: 'booking/payment.success',
            data: { bookingId: booking._id.toString() }
          });
        } catch (e) {
          console.error('Error triggering payment.success event', e);
        }

        return res.json({ success: true, message: 'Booking verified and updated' });
      }
      return res.json({ success: true, message: 'Booking already verified' });
    } else {
      return res.status(400).json({ success: false, message: 'Payment not successful yet' });
    }
  } catch (error) {
    console.log('VERIFY SESSION ERROR:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ================= DOWNLOAD TICKET (PDF) =================
router.get('/:id/ticket', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('show user');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.status !== 'paid') return res.status(400).json({ success: false, message: 'Booking is not paid' });

    const doc = new PDFDocument({ margin: 50 });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ticket-${booking._id}.pdf`);
    
    // Pipe the PDF into the response
    doc.pipe(res);

    // Styling the PDF
    doc.fontSize(25).fillColor('#e83e8c').text('QuickShow Ticket', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(16).fillColor('#000000').text(`Movie: ${booking.show?.movie?.title || 'Unknown'}`);
    doc.fontSize(14).text(`Time: ${new Date(booking.show?.showDateTime).toLocaleString()}`);
    doc.moveDown();
    
    doc.fontSize(14).text(`Name: ${booking.user?.firstName || 'Guest'} ${booking.user?.lastName || ''}`.trim());
    doc.text(`Seats: ${booking.bookedSeats.join(', ')}`);
    doc.text(`Total Amount: Rs ${booking.amount}`);
    doc.moveDown();

    // Generate QR Code as Buffer
    const qrData = JSON.stringify({ bookingId: booking._id, seats: booking.bookedSeats });
    const qrImageBuffer = await QRCode.toBuffer(qrData, { type: 'png', width: 200 });

    // Embed QR Code
    doc.image(qrImageBuffer, {
      fit: [200, 200],
      align: 'center',
      valign: 'center'
    });
    
    doc.end();
  } catch (error) {
    console.error('DOWNLOAD TICKET ERROR:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;