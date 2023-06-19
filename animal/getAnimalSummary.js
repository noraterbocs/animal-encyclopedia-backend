import express from 'express';
import Animal from './animalModel';

const router = express.Router();

// GET animal descriptions
router.get('/animals/:animalId', async (req, res) => {
  try {
    const { animalId } = req.params;
    const idRegEx = new RegExp(animalId);
    const animal = await Animal.findOne({ animalId: idRegEx });

    res.status(200).json({ success: true, response: animal });
  } catch (error) {
    res.status(500).json({ success: false, response: 'Internal server error.' });
  }
});

export default router;
