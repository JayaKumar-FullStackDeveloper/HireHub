const Candidate = require('../models/candidateModels');
const bcrypt = require('bcryptjs');

const  createCandidate = async (req, res) => {
  try {
    const { fullName, email, dob, gender,age, mobileNumber, qualification, passedOut, password } = req.body;

    const existingCandidate = await Candidate.findOne({ $or: [{ email }, { mobileNumber }] });
    if (existingCandidate) {
      return res.status(400).json({ message: 'Email or mobile number already exists' });
    }
    const formattedDob = dob ? new Date(dob).toISOString().split('T')[0] : '';
    const resume = req.file ? req.file.path : null; 

    const candidate = new Candidate({
      fullName,
      email,
      dob: formattedDob, 
      gender,
      age,
      mobileNumber,
      qualification,
      passedOut,
      password,
      resume,
    });
    await candidate.save();
    res.status(201).json({ message: 'Candidate created successfully', candidate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const updateCandidateById = async (req, res) => {
    try {
      const { fullName, email, dob, gender, mobileNumber, qualification, passedOut, paymentStatus,age } = req.body;
  
      const resume = req.file ? req.file.path : null;
  
      // Check if email or mobile number already exists for another candidate
      const existingCandidate = await Candidate.findOne({
        $or: [{ email }, { mobileNumber }],
        _id: { $ne: req.params.id }
      });
  
      if (existingCandidate) {
        return res.status(400).json({ message: 'Email or mobile number already exists' });
      }
  
      // Prepare update data
      const updateData = {};
  
      if (fullName) updateData.fullName = fullName;
      if (email) updateData.email = email;
      if (dob) updateData.dob = dob;
      if (gender) updateData.gender = gender;
      if (mobileNumber) updateData.mobileNumber = mobileNumber;
      if (qualification) updateData.qualification = qualification;
      if (passedOut) updateData.passedOut = passedOut;
      if (paymentStatus) updateData.paymentStatus = paymentStatus;
      // if (password) updateData.password = password;
      if (resume) updateData.resume = resume;
      if (age) updateData.age = age;
  
      const candidate = await Candidate.findById(req.params.id);
  
      if (!candidate) {
        return res.status(404).json({ message: 'Candidate not found' });
      }
        if (paymentStatus && paymentStatus !== candidate.paymentStatus && paymentStatus === 'Paid') {
        updateData.paymentStatusChangedAt = Date.now(); 
      }
      const updatedCandidate = await Candidate.findByIdAndUpdate(req.params.id, updateData, {
        new: true, runValidators: true
      });
  
      res.status(200).json({ message: 'Candidate updated successfully', candidate: updatedCandidate });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  
const deleteCandidateById = async (req, res) => {
    try {
      const candidate = await Candidate.findByIdAndDelete(req.params.id);
      if (!candidate) {
        return res.status(404).json({ message: 'Candidate not found' });
      }
  
      res.status(200).json({ message: 'Candidate deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

 const getAllCandidates = async (req, res) => {
    try {
      const candidates = await Candidate.find();
  
      if (!candidates || candidates.length === 0) {
        return res.status(404).json({ message: 'No candidates found' });
      }
  
      return res.status(200).json(candidates);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
module.exports={ createCandidate,updateCandidateById , deleteCandidateById, getAllCandidates}