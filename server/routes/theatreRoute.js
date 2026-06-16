import express from 'express';
import Theatre from '../models/theatre.js';

const router = express.Router();

// GET all theatres
router.get('/', async (req, res) => {
  try {
    const theatres = await Theatre.find();
    res.json({ success: true, theatres });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ADD theatre
router.post('/add', async (req, res) => {
  try {
    const { name, location, city } = req.body;

    const theatre = new Theatre({ name, location, city });
    await theatre.save();

    res.json({ success: true, theatre });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;