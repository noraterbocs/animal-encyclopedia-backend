import validator from 'validator';
import crypto from 'crypto';
import mongooseConnection from '../mongoose';

export const isValidUsername = /^[a-zA-Z0-9_.-]{8,}$/;
const userSchema = new mongooseConnection.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => isValidUsername.test(value),
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isStrongPassword(value),
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
    },
  },
  createdAt: {
    type: String,
    default: () => new Date(),
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString('hex'),
  },
  avatar: {
    type: String,
    default: '/images/avatars/AlligatorAvatar.png',
  },
  badges: {
    type: Array,
    default: [{
      id: 1,
      title: 'explorer',
      path: '/images/badges/Explorer.png',
      description: 'Congratulations! You have earned the Explorer badge! As an explorer, you have taken your first steps into the exciting world of animals. You have shown curiosity and a keen interest in learning about different species. Keep exploring and discovering fascinating facts about animals from all around the world.',
    }],
  },
  history: {
    type: Array,
    default: [
    ],
  },
  totalScore: {
    type: Number,
    default: 0,
  },
});

const User = mongooseConnection.model('User', userSchema);

export default User;
