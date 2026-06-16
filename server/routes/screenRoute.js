import express from 'express';
import Screen from '../models/Screen.js';

const router = express.Router();

// GET all screens
router.get('/', async (req, res) => {
  try {
    const screens = await Screen.find().populate('theatre');
    res.json({ success: true, screens });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ADD screen
router.post('/add', async (req, res) => {
  try {
    const { theatreId, theatre, name, seatRows, seatTiers } = req.body;

    const screen = new Screen({
      name,
      theatre: theatre || theatreId,
      seatRows,
      seatTiers,
    });

    await screen.save();

    res.json({ success: true, screen });
  } catch (error) {
    console.error('ADD SCREEN ERROR:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;