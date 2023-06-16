/* eslint-disable no-underscore-dangle */
import express from 'express';
import bcrypt from 'bcrypt';
import User from './userModel';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(201).json({
        success: true,
        response: {
          email: user.email,
          id: user._id,
          accessToken: user.accessToken,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        response: 'The email address or password is incorrect. Please try again.',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      response: {
        error,
        message: 'Internal server error',
      },
    });
  }
});

export default router;
