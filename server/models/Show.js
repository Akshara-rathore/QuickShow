import mongoose from 'mongoose';

const showSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  showDateTime: {
    type: Date,
    required: true,
  },
  showPrice: {
    type: Number,
    required: true,
  },
  seatTiers: {
    type: [{
      name: String,      // 'Platinum', 'Gold', 'Silver'
      price: Number,     // Price for this tier
      rows: [String],    // e.g., ['F', 'G']
    }],
    default: [
      { name: 'Platinum', price: 400, rows: ['F', 'G'] },
      { name: 'Gold', price: 250, rows: ['C', 'D', 'E'] },
      { name: 'Silver', price: 150, rows: ['A', 'B'] }
    ]
  },
  // Map of seat IDs (e.g., "A1") to user IDs
  occupiedSeats: {
    type: Map,
    of: String,
    default: {},
  },
}, { timestamps: true });

const Show = mongoose.model('Show', showSchema);
export default Show;
