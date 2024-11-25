const { verifyToken } = require('../utils/jwtUtils');
const Admin = require('../models/adminModels');

const protectAdmin = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.headers.token) {
    token = req.headers.token;
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = verifyToken(token);
    const adminId = decoded.id.id;
    if (!adminId) {
      return res.status(401).json({ message: 'Not authorized, invalid token payload' });
    }
    const admin = await Admin.findById(adminId).select('-password'); 
    if (!admin) {
      return res.status(401).json({ message: 'Not authorized, admin not found' });
    }

    req.admin = admin;

    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protectAdmin };
