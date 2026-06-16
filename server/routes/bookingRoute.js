import express from 'express';
import Stripe from 'stripe';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import User from '../models/User.js';
import { inngest } from '../inngest/client.js';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { sendEmail } from '../utils/emailService.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const findOrCreateUser = async (clerkId, userData = {}) => {
  let user = await User.findOne({ clerkId });

  if (!user) {
    user = await User.create({
      clerkId,
      name: userData.name || 'User',
      email: userData.email || `${clerkId}@quickshow.local`,
      image: userData.image || '',
    });
  } else {
    if (userData.email && user.email.endsWith('@quickshow.local')) {
      user.email = userData.email;
      user.name = userData.name || user.name;
      user.image = userData.image || user.image;
      await user.save();
    }
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
      return res.status(404).json({
        success: false,
        message: 'Show not found',
      });
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

      const rowLetter = seat.charAt(0);
      const tier =
        show.seatTiers?.find((t) => t.rows.includes(rowLetter)) || {
          name: 'Standard',
          price: show.showPrice,
        };

      amount += tier.price;

      if (!groupedByTier[tier.name]) {
        groupedByTier[tier.name] = {
          price: tier.price,
          count: 0,
          seats: [],
        };
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
      success_url:
        'http://localhost:5173/my-booking?session_id={CHECKOUT_SESSION_ID}',
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
      .populate({
        path: 'show',
        populate: {
          path: 'movie',
          model: 'Movie'
        }
      })
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

// ================= GET ALL BOOKINGS =================
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
      return res.status(400).json({
        success: false,
        message: 'sessionId is required',
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Payment not successful yet',
      });
    }

    const bookingId = session.metadata.bookingId;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (booking.status === 'pending') {
      booking.status = 'paid';
      await booking.save();
    }

    const paidBooking = await Booking.findById(booking._id)
      .populate('user')
      .populate({
        path: 'show',
        populate: {
          path: 'movie',
        },
      });

    const qrData = JSON.stringify({
      bookingId: paidBooking._id,
      seats: paidBooking.bookedSeats,
    });

    const qrCodeDataUrl = await QRCode.toDataURL(qrData);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #111827; color: white; padding: 25px; border-radius: 16px;">
        <h1 style="color: #ec4899; text-align: center;">QuickShow Ticket</h1>
        <h2 style="text-align: center;">Booking Confirmed 🎟️</h2>

        <div style="background: #1f2937; padding: 18px; border-radius: 12px; margin-top: 20px;">
          <p><b>Movie:</b> ${paidBooking.show?.movie?.title || 'Movie'}</p>
          <p><b>Seats:</b> ${paidBooking.bookedSeats.join(', ')}</p>
          <p><b>Amount:</b> ₹${paidBooking.amount}</p>
          <p><b>Time:</b> ${new Date(
            paidBooking.show?.showDateTime
          ).toLocaleString()}</p>
        </div>

        <div style="text-align: center; margin-top: 25px;">
          <p>Show this QR code at theatre entrance</p>
          <img src="${qrCodeDataUrl}" style="width: 180px; height: 180px;" />
        </div>
      </div>
    `;

    if (
      paidBooking.user?.email &&
      !paidBooking.user.email.endsWith('@quickshow.local')
    ) {
      await sendEmail({
        to: paidBooking.user.email,
        subject: `Your QuickShow Ticket - ${
          paidBooking.show?.movie?.title || 'Movie'
        }`,
        html,
      });

      console.log(`Confirmation email sent to ${paidBooking.user.email}`);
    } else {
      console.log('Email not sent: valid user email not found');
    }

    return res.json({
      success: true,
      message: 'Booking verified and email sent',
    });
  } catch (error) {
    console.log('VERIFY SESSION ERROR:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ================= DOWNLOAD TICKET PDF =================
router.get('/:id/ticket', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('show user');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (booking.status !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Booking is not paid',
      });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=ticket-${booking._id}.pdf`
    );

    doc.pipe(res);

    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#111827');

    doc.roundedRect(40, 40, 520, 80, 20).fill('#e83e8c');

    doc.fillColor('white').fontSize(30).text('QuickShow', 0, 65, {
      align: 'center',
    });

    doc.fontSize(14).text('Movie Ticket', 0, 100, {
      align: 'center',
    });

    doc.roundedRect(40, 150, 520, 220, 20).fill('#1f2937');

    doc
      .fillColor('white')
      .fontSize(28)
      .text(booking.show?.movie?.title || 'Unknown Movie', 70, 180);

    doc
      .fontSize(15)
      .fillColor('#d1d5db')
      .text(
        `Time: ${new Date(booking.show?.showDateTime).toLocaleString()}`,
        70,
        230
      );

    doc.text(`Seats: ${booking.bookedSeats.join(', ')}`, 70, 260);
    doc.text(`Amount: ₹ ${booking.amount}`, 70, 290);

    doc.text(
      `Booked By: ${booking.user?.name || booking.user?.firstName || 'Guest'}`,
      70,
      320
    );

    const qrData = JSON.stringify({
      bookingId: booking._id,
      seats: booking.bookedSeats,
    });

    const qrImageBuffer = await QRCode.toBuffer(qrData, {
      type: 'png',
      width: 220,
    });

    doc.image(qrImageBuffer, 350, 190, {
      width: 150,
    });

    doc
      .fontSize(12)
      .fillColor('#9ca3af')
      .text('Please show this ticket at theatre entrance', 0, 720, {
        align: 'center',
      });

    doc.end();
  } catch (error) {
    console.error('DOWNLOAD TICKET ERROR:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;