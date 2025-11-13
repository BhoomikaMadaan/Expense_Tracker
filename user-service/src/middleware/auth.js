const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization');
  
  if (!token) {
    return res.json(
    { success:false,
      error: 'Unauthorized' 

    });
  }
  
  try {
    const decoded = jwt.verify(token, 'mysecret');
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    res.json({
      success:false,
       error: 'Unauthorized'
       });
  }
};

module.exports = auth;