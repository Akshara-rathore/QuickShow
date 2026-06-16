import express from 'express';
import Movie from '../models/movie.js';
import Show from '../models/Show.js'; // Kept in case it's needed elsewhere

const router = express.Router();

// GET all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      movies,
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch movies',
      error: error.message,
    });
  }
});

// GET now showing movies
router.get('/now-showing', async (req, res) => {
  try {
    const movies = await Movie.find({ status: 'now_showing' }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      movies,
    });
  } catch (error) {
    console.error('Error fetching now showing movies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch now showing movies',
      error: error.message,
    });
  }
});

// GET coming soon movies
router.get('/coming-soon', async (req, res) => {
  try {
    const movies = await Movie.find({ status: 'coming_soon' }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      movies,
    });
  } catch (error) {
    console.error('Error fetching coming soon movies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch coming soon movies',
      error: error.message,
    });
  }
});

export default router;