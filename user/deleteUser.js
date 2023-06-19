import express from 'express';
import User from './userModel';
import authenticateUser from './authenticateUser';

const router = express.Router();

// Delete user account
router.delete('/user', authenticateUser);
router.delete('/user', async (req, res) => {
  try {
    const accessToken = req.header('Authorization');
    const deletedUser = await User.deleteOne(
      { accessToken },
    );
    if (deletedUser) {
      res.status(200).json({ success: true, response: 'Your account was successfully deleted!' });
    } else {
      res.status(404).json({ success: false, response: 'User not found.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, response: error });
  }
});

export default router;
