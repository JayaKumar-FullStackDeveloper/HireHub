const jwt = require('jsonwebtoken');

const generateToken = (id, role, email) => {
  return jwt.sign({ id, role , email }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };