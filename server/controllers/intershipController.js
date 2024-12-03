const adminModels = require('../models/adminModels');
const InternshipApplication = require('../models/InternshipModel');

const getAllApplications = async (req, res) => {
    try {
        const applications = await InternshipApplication.find();
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
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

// Create a new application
const createApplication = async (req, res) => {
    const { firstName, lastName, email, contactNumber, resume, companyName, internshipTitle, status } = req.body;
    try {
        const newApplication = new InternshipApplication({  firstName, lastName, email, contactNumber, resume, companyName, internshipTitle, status,adminId  });
        await newApplication.save();
        res.status(201).json(newApplication);
        if (adminId) {
            logAdminActivity(adminId, `Created Internship with email ${email} for ${fullName}`);
          } else {
            console.log('No adminId found in request');
          }
    } catch (error) {
        res.status(400).json({ message: 'Error Creating Application', error });
    }
};


const updateApplicationStatus = async (req, res) => {
    try {
      const { firstName, lastName, contactNumber, email, companyName, internshipTitle, status, adminId } = req.body;
    //   console.log("Headers:", req.headers);
    //   console.log("Body:", req.body);
         
        const resume = req.file ? req.file.path : null;
        const existingInternship = await InternshipApplication.findOne({
        $or: [{ email }, { contactNumber }],
        _id: { $ne: req.params.id }
      });
  
      if (existingInternship) {
        return res.status(400).json({ message: 'Email or mobile number already exists' });
      }
  
      const updateData = {};
  
      if (firstName) updateData.firstName = (firstName);
      if (lastName) updateData.lastName = (lastName);
      if (email) updateData.email = email.toLowerCase();
      if (contactNumber) updateData.contactNumber = contactNumber;
      if (companyName) updateData.companyName = companyName;
      if (internshipTitle) updateData.internshipTitle = internshipTitle;
      if (status) updateData.status = status;
      if (resume) updateData.resume = resume;  
      const intern = await InternshipApplication.findById(req.params.id);
      if (!intern) {
        return res.status(404).json({ message: 'Internship not found' });
      }
  
      const updatedIntern = await InternshipApplication.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );
      if (adminId) {
        logAdminActivity(adminId, `Updated Internship in ${companyName} to ${firstName}`);
      } else {
        console.log('No adminId found in request');
      }
  
      res.status(200).json({ message: 'Internship updated successfully', Internship: updatedIntern });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
// Delete an application
const deleteApplication = async (req, res) => {
    const { id } = req.params;
    try {
        const application = await InternshipApplication.findByIdAndDelete(id);
        if (!application) return res.status(404).json({ message: 'Application Not Found' });
        res.status(200).json({ message: 'Application Deleted Successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error Deleting Application', error });
    }
};

module.exports ={deleteApplication,updateApplicationStatus,createApplication,getAllApplications}