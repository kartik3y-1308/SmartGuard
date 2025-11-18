const User = require('../models/User');

const adminMiddleware = async (req, res, next) => {
  try {
    // We get req.user.id from the authMiddleware that runs before this
    const user = await User.findById(req.user.id);

    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Not an admin.' });
    }

    // If the user is an admin, proceed to the next function
    next();
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = adminMiddleware;