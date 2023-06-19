import express from 'express';
import Game from './gameModel';
import authenticateUser from '../user/authenticateUser';

const router = express.Router();

// Get all generated stories
router.get('/completion', authenticateUser);
router.get('/completion', async (req, res) => {
  try {
    const games = await Game.find({})
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, response: games });
  } catch (error) {
    res.status(500).json({ success: false, response: 'Internal server error.' });
  }
});

export default router;
