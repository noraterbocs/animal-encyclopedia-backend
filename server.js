// /* eslint-disable no-console */

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
app.use('/animals', animalRoutes);
app.use('/games', gameRoutes);
app.use('/users', userRoutes);

const listEndpoints = require('express-list-endpoints');

app.get('/', (req, res) => {
  res.json(listEndpoints(app));
});

app.get('*', (req, res) => {
  res.status(404).send('404 Not Found');
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
