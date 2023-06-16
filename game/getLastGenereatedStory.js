/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import express from 'express';
import Game from './gameModel';
import authenticateUser from '../user/authenticateUser';
import User from '../user/userModel';

const router = express.Router();

// Get last generated story
router.get('/completion/lastgeneratedstory', authenticateUser);
router.get('/completion/lastgeneratedstory', async (req, res) => {
  const accessToken = req.header('Authorization');
  const user = await User.findOne({ accessToken });
  console.log(user);
  try {
    if (user) {
      const lastGeneratedStory = await Game.find({ userId: user._id.toString() })
        .sort({ createdAt: -1 })
        .limit(1);
      console.log(lastGeneratedStory);
      res.status(200).json({ success: true, response: lastGeneratedStory[0].createdAt });
    } else {
      res.status(401).json({ success: false, response: 'User not found.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, response: 'Internal server error.' });
  }
});

export default router;
