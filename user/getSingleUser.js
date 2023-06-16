import express from 'express';
import User from './userModel';
import authenticateUser from './authenticateUser';

const router = express.Router();

// Get user info and post totalScore
router.get('/user', authenticateUser);
router.get('/user', async (req, res) => {
  const accessToken = req.header('Authorization');
  const user = await User.findOne({ accessToken });
  try {
    if (user) {
      res.status(200).json({ success: true, response: user });
    } else {
      res.status(401).json({ success: false, response: 'Could not find user.' });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      response: {
        message: 'Internal server error',
        error,
      },
    });
  }
});

export default router;
