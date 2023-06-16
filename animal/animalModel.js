import mongooseConnection from '../mongoose';

const animalSchema = new mongooseConnection.Schema({
  animalName: {
    type: String,
  },
  animalIntroduction: {
    type: String,
  },
  animalDiet: {
    type: String,
  },
  animalReproduction: {
    type: String,
  },
  animalFacts: {
    type: String,
  },
  imageURL1: {
    type: String,
  },
  imageURL2: {
    type: String,
  },
  imageURL3: {
    type: String,
  },
  animalId: {
    type: String,
  },
});

const Animal = mongooseConnection.model('Animal', animalSchema);

export default Animal;
