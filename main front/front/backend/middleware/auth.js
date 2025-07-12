const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './config.env' });

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token required' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }
    req.user = user;
    next();
  });
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }
};

// Middleware to check if user owns the resource or is admin
const isOwnerOrAdmin = (req, res, next) => {
  const userId = parseInt(req.params.id || req.params.userId);
  
  if (req.user.role === 'admin' || req.user.id === userId) {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      message: 'Access denied' 
    });
  }
};

module.exports = {
  authenticateToken,
  isAdmin,
  isOwnerOrAdmin
}; 