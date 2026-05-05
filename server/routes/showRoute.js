import express from 'express';
import Show from '../models/Show.js';
import { inngest } from '../inngest/client.js';

const router = express.Router();

// Get all shows
router.get('/', async (req, res) => {
  try {
    const shows = await Show.find().sort({ showDateTime: 1 });
    res.json({ success: true, shows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add a new show (Admin)
router.post('/add', async (req, res) => {
  try {
    const { movie, showDateTime, showPrice } = req.body;

    const newShow = new Show({
      movie,
      showDateTime,
      showPrice,
      occupiedSeats: {}
    });

    await newShow.save();

    // Trigger Inngest event to notify users about the new movie
    try {
      await inngest.send({
        name: 'movie/new.added',
        data: {
          showId: newShow._id,
          movieTitle: movie.title,
          showDateTime
        }
      });
    } catch (inngestErr) {
      console.error('Inngest error (non-fatal):', inngestErr.message);
    }

    res.status(201).json({ success: true, show: newShow });
  } catch (error) {
    console.error('Error adding show:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a show (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const showId = req.params.id;
    const deletedShow = await Show.findByIdAndDelete(showId);
    
    if (!deletedShow) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    res.json({ success: true, message: 'Show deleted successfully' });
  } catch (error) {
    console.error('Error deleting show:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
