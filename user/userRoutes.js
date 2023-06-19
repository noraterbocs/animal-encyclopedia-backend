import express from 'express';
import changeSingleUserData from './changeSingleUserData';
import deleteUser from './deleteUser';
import getAllUsers from './getAllUsers';
import getSingleUser from './getSingleUser';
import loginUser from './loginUser';
import registerUser from './registerUser';

const router = express.Router();

router.use('/', registerUser);
router.use('/', loginUser);
router.use('/', getSingleUser, deleteUser, changeSingleUserData);
router.use('/', getAllUsers);

export default router;
