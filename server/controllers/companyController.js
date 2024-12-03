const adminModels = require('../models/adminModels');
const Company = require('../models/companyModel');

const createCompany = async (req, res) => {
    try {
        const company = new Company(req.body);
        await company.save();
        res.status(201).json(company);
      } catch (error) {
        console.error('Error creating company:', error);
        res.status(500).json({ message: 'Server error' , error: error.message});
      }
};

const logAdminActivity = async (adminId, action) => {
  try {
    const admin = await adminModels.findById(adminId);
    if (admin) {
      admin.activities.push({ action, timestamp: new Date() });
      await admin.save();
      console.log(`Activity logged for Admin ID ${adminId}: ${action}`);
    } else {
      console.log('Admin not found for logging activity');
    }
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};
const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching companies', error: err.message });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.status(200).json(company);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching company', error: err.message });
  }
};

const updateCompanyById = async (req, res) => {
  try {
    const { name, email, location, founded, description, status,pincode , adminId } = req.body;

    const existingCompany = await Company.findOne({
      email,
      _id: { $ne: req.params.id }
    });

    if (existingCompany) {
      return res.status(400).json({ message: 'Email already exists for another company' });
    }

    // Prepare update data
    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (location) updateData.location = location;
    if (founded) updateData.founded = founded;
    if (pincode) updateData.pincode = pincode;
    if (description) updateData.description = description;
    if (status) updateData.status = status;

    // Check if the company exists
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // If status changed and it's "Approved", add a timestamp for when it was updated
    if (status && status !== company.status && status === 'Approved') {
      updateData.statusUpdatedAt = Date.now(); // Add timestamp when status is updated
    }

    // Perform the update
    const updatedCompany = await Company.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });
    if (adminId) {
      logAdminActivity(adminId, `Updated Company details of ${company.name}`);
    } else {
      console.log('No adminId found in request');
    }

    res.status(200).json({ message: 'Company updated successfully', company: updatedCompany });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting company', error: err.message });
  }
};

module.exports = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompanyById,
  deleteCompany,
};
