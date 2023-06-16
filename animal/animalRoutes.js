import express from 'express';
import getAnimalSummary from './getAnimalSummary';

const router = express.Router();

router.use('/animals/:animalId', getAnimalSummary);

export default router;
