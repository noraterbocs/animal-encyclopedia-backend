import express from 'express';
import changeSingleUserData from './changeSingleUserData';
import deleteUser from './deleteUser';
import getAllUsers from './getAllUsers';
import getSingleUser from './getSingleUser';
import loginUser from './loginUser';
import registerUser from './registerUser';

const router = express.Router();

router.use('/register', registerUser);
router.use('/login', loginUser);
router.use('/user', getSingleUser, deleteUser, changeSingleUserData);
router.use('/users', getAllUsers);

export default router;
