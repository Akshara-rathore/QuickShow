import { inngest } from './client.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import { sendEmail } from '../utils/emailService.js';
import QRCode from 'qrcode';

export const sendNewMovieNotification = inngest.createFunction(
  { id: 'send-new-movie-notification', event: 'movie/new.added' },
  async ({ event, step }) => {
    const { showId, movieTitle, showDateTime } = event.data;

    // Fetch all users
    const users = await step.run('fetch-users', async () => {
      return await User.find({}, 'email firstName');
    });

    // In a real app, use Resend, SendGrid, etc. to send emails
    // For now, we simulate sending emails
    await step.run('send-emails', async () => {
      console.log(`Sending email to ${users.length} users about new movie: ${movieTitle} at ${showDateTime}`);
      return { success: true, count: users.length };
    });

    return { message: 'Emails sent successfully' };
  }
);

export const releaseSeatsOnPaymentTimeout = inngest.createFunction(
  { id: 'release-seats-timeout', event: 'booking/payment.timeout' },
  async ({ event, step }) => {
    const { bookingId, showId, seats } = event.data;

    // Wait for 5 minutes
    await step.sleep('wait-5-mins', '5m');

    await step.run('check-and-release-seats', async () => {
      const booking = await Booking.findById(bookingId);
      
      // If payment wasn't successful, cancel booking and release seats
      if (booking && booking.status === 'pending') {
        booking.status = 'cancelled';
        await booking.save();

        const show = await Show.findById(showId);
        if (show) {
          for (const seat of seats) {
            show.occupiedSeats.delete(seat);
          }
          await show.save();
          console.log(`Released seats ${seats.join(', ')} for show ${showId}`);
        }
      }
    });

    return { message: 'Timeout check completed' };
  }
);

export const sendBookingConfirmationEmail = inngest.createFunction(
  { id: 'send-booking-confirmation', event: 'booking/payment.success' },
  async ({ event, step }) => {
    const { bookingId } = event.data;

    await step.run('send-receipt-email', async () => {
      const booking = await Booking.findById(bookingId).populate('show user');
      if (!booking) return;

      const user = await User.findById(booking.user);
      if (!user) return;

      // Generate QR Code
      const qrData = JSON.stringify({ bookingId: booking._id, seats: booking.bookedSeats });
      const qrCodeDataUrl = await QRCode.toDataURL(qrData);

      const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #fdfdfd; padding: 20px; border-radius: 8px;">
          <h1 style="color: #e83e8c;">QuickShow Tickets</h1>
          <h2>Your tickets are confirmed!</h2>
          <p>Hi ${user.name}, your payment of Rs ${booking.amount} was successful.</p>
          <div style="background: #f1f1f1; padding: 15px; border-radius: 5px;">
            <p><strong>Movie:</strong> ${booking.show?.movie?.title || 'Movie'}</p>
            <p><strong>Seats:</strong> ${booking.bookedSeats.join(', ')}</p>
            <p><strong>Time:</strong> ${new Date(booking.show?.showDateTime).toLocaleString()}</p>
          </div>
          <div style="text-align: center; margin-top: 20px;">
            <p>Please show this QR code at the entrance:</p>
            <img src="${qrCodeDataUrl}" alt="Ticket QR Code" style="width: 200px; height: 200px;" />
          </div>
        </div>
      `;

      await sendEmail({
        to: user.email,
        subject: `Your QuickShow Tickets: ${booking.show?.movie?.title || 'Movie'}`,
        html,
      });
      console.log(`Confirmation email sent to ${user.email}`);
    });

    return { message: 'Confirmation email sent' };
  }
);
