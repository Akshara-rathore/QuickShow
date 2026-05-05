import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  bookedSeats: [{
    type: String,
    required: true,
  }],
  status: {
    type: String,
    enum: ['pending', 'paid', 'cancelled'],
    default: 'pending',
  },
  stripeSessionId: {
    type: String,
  },
  expiresAt: {
    type: Date,
    // Automatically expires 10 minutes from creation if not paid
    default: () => new Date(Date.now() + 10 * 60 * 1000),
  },
}, { timestamps: true });

// Add TTL index to automatically delete pending bookings after 10 minutes if we wanted to
// (But we will use Inngest for more robust logic as requested by user)
// bookingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
