const Admin = require('../models/adminModels');
const { generateToken } = require('../utils/jwtUtils');
const registerAdmin = async (req, res) => {
  try {
    console.log('Request Body:', req.body); // Log the request body
    
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists.' });
    }

    const newAdmin = new Admin({ name, email, password });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully!', admin: newAdmin });
  } catch (error) {
    console.error('Error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message, errors: error.errors });
    }
    res.status(500).json({ message: 'Server error', error });
  }
};

const loginAdmin = async (req, res) => {
  try {
    // console.log('Request Body:', req.body);
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = generateToken({id: admin._id , role: admin.role , email: admin.email})
    // res.json({ token , id: admin._id , role: admin.role , email: admin.email});
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json({ id: admin._id, email: admin.email, role: admin.role });
    console.log( res.json);
    
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAdminProfile
};
