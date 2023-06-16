import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import animalRoutes from './animal/animalRoutes';
import gameRoutes from './game/gameRoutes';
import userRoutes from './user/userRoutes';

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

export default app;
