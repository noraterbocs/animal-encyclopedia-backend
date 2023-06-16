import express from 'express';
import generateStory from './generateStory';
import getAllStories from './getAllStories';
import getLastGeneratedStory from './getLastGenereatedStory';

const router = express.Router();

router.use('/completions', generateStory);
router.use('/completion', getAllStories);
router.use('/completion/lastgeneratedstory', getLastGeneratedStory);

export default router;
