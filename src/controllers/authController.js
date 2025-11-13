const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.json({
      success: false,
      message: 'User already exists'
    });
  }
  
  const user = new User({ name, email, password });
  await user.save();
  
  res.json({
    success: true,
    message: 'User registered'
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user || user.password !== password) {
    return res.json({ 
      success: false,
      message: 'Invalid credentials' 
    });
  }
  
  const token = jwt.sign({ userId: user._id }, 'mysecret', { expiresIn: '7d' });
  res.json({ token });
};

module.exports = { register, login };