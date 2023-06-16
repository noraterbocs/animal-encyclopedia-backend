// /* eslint-disable no-console */
// import { createServer } from 'http';
// import app from './app';

// require('dotenv').config();

// // const server = createServer(app);

// const PORT = process.env.PORT || 8080;

// // eslint-disable-next-line consistent-return
// server.listen(PORT, (error) => {
//   if (error) {
//     return console.log(error);
//   }
//   console.log(`🚀 Server started on port ${PORT}`);
// });

// // server.listen(PORT, () => {
// //   console.log(`🚀 Server running on http://localhost:${PORT}`);
// // });

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import animalRoutes from './animal/animalRoutes';
import gameRoutes from './game/gameRoutes';
import userRoutes from './user/userRoutes';

require('dotenv').config();

const PORT = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/animal', animalRoutes);
app.use('/game', gameRoutes);
app.use('/user', userRoutes);

const listEndpoints = require('express-list-endpoints');

app.get('/', (req, res) => {
  res.json(listEndpoints(app));
});

app.get('*', (req, res) => {
  res.status(404).send('404 Not Found');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
