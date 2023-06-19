import User from './userModel';

// Authenticate user
const authenticateUser = async (req, res, next) => {
  const accessToken = req.header('Authorization');
  try {
    const user = await User.findOne({ accessToken });
    if (user) {
      next();
    } else {
      res.status(401).json({
        success: false,
        response: 'Authentication failed.',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      response: {
        message: 'Internal server error!',
        error,
      },
    });
  }
};

export default authenticateUser;
