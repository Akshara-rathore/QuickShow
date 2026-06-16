import mongoose from 'mongoose';

const theatreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Theatre = mongoose.model('Theatre', theatreSchema);
export default Theatre;
