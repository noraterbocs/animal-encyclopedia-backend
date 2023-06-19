import express from 'express';
import generateStory from './generateStory';
import getAllStories from './getAllStories';
import getLastGeneratedStory from './getLastGenereatedStory';

const router = express.Router();

router.use('/', generateStory);
router.use('/', getAllStories);
router.use('/', getLastGeneratedStory);

export default router;
