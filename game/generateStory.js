/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import express from 'express';
import Game from './gameModel';
import authenticateUser from '../user/authenticateUser';
import User from '../user/userModel';

require('dotenv').config();

const router = express.Router();
const { API_KEY } = process.env;
const { API_KEY_IMG } = process.env;

// Generating a story:
router.post('/completions', authenticateUser);
router.post('/completions', async (req, res) => {
  const {
    mainCharacter, location, friends, genre,
  } = req.body;
  // generate text
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Tell a funny kids story in 150 words that has a life lesson and starts with a title.
        It should be about a ${mainCharacter} who lived in ${location} together with ${friends}.
        The genre is ${genre}.
        Give all characters names.`,
        },
      ],
      max_tokens: 250,
    }),
  };
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', options);
    const newText = await response.json();

    const accessToken = req.header('Authorization');

    // GET images

    const optionsImage = {
      method: 'GET',
      headers: {
        Authorization: `Client-ID ${API_KEY_IMG}`,
        'Content-Type': 'application/json',
      },
    };

    const responseImage = await fetch(`https://api.unsplash.com/photos/random?query=${mainCharacter}&orientation=squarish`, optionsImage);
    const newImage = await responseImage.json();
    console.log(newImage);
    if (newText && newImage) {
      const trimmedText = newText.choices[0].message.content.trim();
      const newlineIndex = trimmedText.indexOf('\n');

      const user = await User.findOne({ accessToken });
      const newGame = await new Game({
        mainCharacter,
        location,
        friends,
        genre,
        title: trimmedText.substring(0, newlineIndex).trim(),
        newGeneratedText: trimmedText.substring(newlineIndex + 1).trim(),
        userId: user._id,
        userAvatar: user.avatar,
        username: user.username,
        image: newImage.urls.small,
      }).save();

      res.status(200).json({ success: true, response: newGame });
    } else {
      res.status(400).json({
        success: false,
        response: 'The text generation or getting the images have failed.',
      });
    }
  } catch (error) {
    console.error(error);
  }
});

export default router;
