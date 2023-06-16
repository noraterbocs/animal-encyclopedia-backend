/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import express from 'express';
import User from './userModel';
import authenticateUser from './authenticateUser';

const router = express.Router();

// Get all users and their total scores
router.get('/users', authenticateUser);
router.get('/users', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // default limit is 10
    const users = await User.find({}, 'username totalScore avatar _id')
      .sort({ totalScore: -1 }) // Sort by createdAt field in descending order
      .limit(limit);

    const usersData = users.map((user) => ({
      username: user.username,
      avatar: user.avatar,
      id: user._id,
      totalScore: user.totalScore,
    }));
    res.status(200).json({ success: true, response: usersData });
  } catch (error) {
    res.status(500).json({ success: false, response: 'Internal server error.' });
  }
});

export default router;
