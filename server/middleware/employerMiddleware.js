const { verifyToken } = require('../utils/jwtUtils');
const Employer = require('../models/employerModel');

const protectUser = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = verifyToken(token);
      console.log('Decoded Token:', decoded);

      // Extract the actual ID
      const employerId = decoded.id?.id;
      console.log('Extracted Employer ID:', employerId);

      // Query Employer collection
      const employer = await Employer.findById(employerId).select('-password');
      console.log(employer);
      
      if (!employer) {
        return res.status(404).json({ message: 'Employer not found' });
      }
      req.employerId = employerId;
      next();
    } catch (error) {
      console.error('Error verifying token or querying database:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protectUser };
