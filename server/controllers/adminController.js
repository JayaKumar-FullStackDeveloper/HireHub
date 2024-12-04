const Admin = require('../models/adminModels');
const Company = require('../models/companyModel');
const Candidate = require('../models/candidateModels');
const JobsApplication = require('../models/jobsModel');
const InternshipApplication = require('../models/InternshipModel');
const { generateToken } = require('../utils/jwtUtils');
const bcrypt = require('bcryptjs');

const registerAdmin = async (req, res) => {
  try {
    console.log('Request Body:', req.body); 
    
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
    const token = generateToken({id: admin._id , role: admin.role , email: admin.email, name: admin.name})
    res.json({ token , id: admin._id , role: admin.role , email: admin.email});
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
    res.json({ id: admin._id, role: admin.role , name: admin.name, activities: admin.activities});
    console.log( res.json);
    
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getRecentActivities = async (req, res) => {
  const { id } = req.params; 
    if (!id) {
      return res.status(400).json({ message: 'Admin ID is required' });
    }

  try {
    const admin = await Admin.findById(id); 
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    const recentActivities = admin.activities.slice(-5).reverse();
    res.status(200).json(recentActivities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getWeeklyActivities = async (req, res) => {
  const { id } = req.params; 
    if (!id) {
      return res.status(400).json({ message: 'Admin ID is required' });
    }
  try {
    const admin = await Admin.findById(id); 
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); 

    const weeklyActivities = admin.activities.filter(activity => new Date(activity.timestamp) > oneWeekAgo);

    res.status(200).json(weeklyActivities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
const updatePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    const updatedAdmin = await Admin.findByIdAndUpdate(
      admin._id,
      {
        password: hashedPassword,
      },
      { new: true }
    );
    console.log("Updated Admin: ", updatedAdmin);
    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const [jobCount, userCount, internshipCount, companyCount] = await Promise.all([
      JobsApplication.countDocuments(),
      Candidate.countDocuments(),
      InternshipApplication.countDocuments(),
      Company.countDocuments(),
    ]);

    const recentCompanies = await Company.find()
      .sort({ createdAt: -1 }) 
      .limit(4)
      .select('name createdAt status'); 

    const response = {
      overallCounts: {
        JobsApplication: jobCount,
        users: userCount,
        InternshipApplication: internshipCount,
        companies: companyCount,
      },
      recentCompanies: recentCompanies.map(company => ({
        name: company.name,
        createdAt: company.createdAt,
        details: company.status || 'No details available', 
      })),
    };

    return res.status(200).json({
      success: true,
      message: 'Dashboard statistics fetched successfully.',
      data: response,
    });
  } catch (error) {
    console.error('Error in getDashboardStats:', error.message);

    // Handle errors and respond
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching dashboard statistics.',
      error: error.message,
    });
  }
};


module.exports = {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  getRecentActivities,
  getWeeklyActivities,
  getDashboardStats,
  updatePassword
};
