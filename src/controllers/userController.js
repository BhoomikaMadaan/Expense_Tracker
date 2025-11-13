const User = require('../models/User');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    res.json({ 
      success: false, 
      message: 'Server error' });
  }
};

module.exports = { getProfile };