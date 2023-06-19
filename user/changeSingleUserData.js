import express from 'express';
import bcrypt from 'bcrypt';
import User from './userModel';
import authenticateUser from './authenticateUser';

const router = express.Router();

// updating total score, history, badges, avatar
router.patch('/user', authenticateUser);
router.patch('/user', async (req, res) => {
  const salt = bcrypt.genSaltSync();
  try {
    const {
      badges, avatar, history, username, password, totalScore,
    } = req.body;
    const accessToken = req.header('Authorization');

    const updateFields = {};
    if (history) {
      updateFields.$push = {};
      if (history) {
        updateFields.$push.history = { $each: [history] };
        updateFields.$inc = { totalScore: parseInt(history.score, 10) };
      }
    }
    if (badges) {
      if (!updateFields.$push) {
        updateFields.$push = {};
      }
      updateFields.$push.badges = { $each: [badges] };
    }
    if (avatar) {
      if (!updateFields.$set) {
        updateFields.$set = {};
      }
      updateFields.$set = { avatar };
    }
    if (totalScore) {
      if (!updateFields.$set) {
        updateFields.$set = { totalScore };
      }
      updateFields.$set = { totalScore };
    }
    if (username) {
      if (!updateFields.$set) {
        updateFields.$set = {};
      }
      updateFields.$set = { username };
    }
    if (password) {
      if (!updateFields.$set) {
        updateFields.$set = {};
      }
      updateFields.$set = { password: bcrypt.hashSync(password, salt) };
    }

    const user = await User.findOneAndUpdate(
      { accessToken },
      updateFields,
      { new: true },
    );

    if (user) {
      res.status(200).json({ success: true, response: user });
    } else {
      res.status(404).json({ success: false, response: 'User not found.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, response: error });
  }
});

export default router;
