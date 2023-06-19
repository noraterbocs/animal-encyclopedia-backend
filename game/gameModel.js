import mongooseConnection from '../mongoose';

const gameSchema = new mongooseConnection.Schema({
  newGeneratedText: {
    type: String,
  },
  mainCharacter: {
    type: String,
  },
  location: {
    type: String,
  },
  friends: {
    type: String,
  },
  genre: {
    type: String,
  },
  userId: {
    type: String,
  },
  userAvatar: {
    type: String,
  },
  username: {
    type: String,
  },
  image: {
    type: String,
    default: 'https://placehold.co/200',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  title: {
    type: String,
  },
});

const Game = mongooseConnection.model('Game', gameSchema);

export default Game;
