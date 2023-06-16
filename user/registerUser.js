/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import express from 'express';
import bcrypt from 'bcrypt';
import validator from 'validator';
import User, { isValidUsername } from './userModel';

const router = express.Router();

// register user and login requests
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  try {
    // Perform password validation
    if (!validator.isStrongPassword(password)) {
      throw new Error('Invalid password. Password must be at least 8 characters long and contain a combination of uppercase letters, lowercase letters, numbers, and special characters.');
    }
    // Perform username validation
    if (!validator.matches(username, isValidUsername)) {
      throw new Error('Invalid username. Username must be at least 8 characters long and can only contain alphanumeric characters, underscores, dots, and dashes.');
    }
    // Perform email validation
    if (!validator.isEmail(email)) {
      throw new Error('Invalid email address.');
    }
    const salt = bcrypt.genSaltSync();
    const newUser = await new User({
      username,
      password: bcrypt.hashSync(password, salt),
      email,
    }).save();
    if (newUser) {
      res.status(201).json({
        success: true,
        response: {
          username: newUser.username,
          email: newUser.email,
          id: newUser._id,
          accessToken: newUser.accessToken,
          password: newUser.password,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        response: 'Failed registration.',
      });
    }
  } catch (error) {
    console.log('Registration error:', error);
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        response: 'Username or email have been already used.',
      });
    } else if (error.message.includes('password')) {
      res.status(400).json({
        success: false,
        response: error.message,
      });
    } else if (error.message.includes('username')) {
      res.status(400).json({
        success: false,
        response: error.message,
      });
    } else if (error.message.includes('email')) {
      res.status(400).json({
        success: false,
        response: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        response: 'Internal server error.',
      });
    }
  }
});

export default router;
