import mongoose from 'mongoose';

const screenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  theatre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theatre',
    required: true,
  },
  seatTiers: {
    type: [{
      name: String,      // 'Platinum', 'Gold', 'Silver'
      priceOffset: Number, // Additional or base price for this tier
      rows: [String],    // e.g., ['F', 'G']
    }],
    default: [
      { name: 'Platinum', priceOffset: 400, rows: ['F', 'G'] },
      { name: 'Gold', priceOffset: 250, rows: ['C', 'D', 'E'] },
      { name: 'Silver', priceOffset: 150, rows: ['A', 'B'] }
    ]
  },
  seatRows: {
    type: [{
      row: String,       // 'A'
      seats: [String],   // ['1', '2', '3', '4', '5', '6', '7', '8', '9']
    }],
    default: [
      { row: 'A', seats: ['1', '2', '3', '4', '5', '6', '7', '8', '9'] },
      { row: 'B', seats: ['1', '2', '3', '4', '5', '6', '7', '8', '9'] },
      { row: 'C', seats: ['1', '2', '3', '4', '5', '6', '7', '8', '9'] },
      { row: 'D', seats: ['1', '2', '3', '4', '5', '6', '7', '8', '9'] },
      { row: 'E', seats: ['1', '2', '3', '4', '5', '6', '7', '8', '9'] },
      { row: 'F', seats: ['1', '2', '3', '4', '5', '6', '7', '8', '9'] },
      { row: 'G', seats: ['1', '2', '3', '4', '5', '6', '7', '8', '9'] },
    ]
  }
}, { timestamps: true });

const Screen = mongoose.model('Screen', screenSchema);
export default Screen;
