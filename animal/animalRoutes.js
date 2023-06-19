import express from 'express';
import getAnimalSummary from './getAnimalSummary';

const router = express.Router();

router.use('/', getAnimalSummary);

export default router;
