const asyncHandler = require("express-async-handler");
const Employer = require("../models/employerModel");
const upload = require("../config/multerConfig");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const crypto = require("crypto");
const verifyEmailTemplate = require("../emails/templates/verifyEmailTemplate");
const sendEmail = require("../utils/emailService");
const { generateToken } = require('../utils/jwtUtils');


const OTP_EXPIRY_TIME = 300; 
const JWT_EXPIRATION = "1h";
const IMAGE_UPLOAD_PATH = "/images/profile/";

const generateOTP = () => crypto.randomInt(1000, 9999).toString();

const getEmployerdetails = asyncHandler(async (req, res) => {
  try {
    const employerId = req.employerId;
    const employer = await Employer.findById(employerId).select("-password");
    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }
    res.json({ id: employer._id, email: employer.email, role: employer.role });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});
const getEmployerById = asyncHandler(async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id).select("-password");
    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }
    res.json(employer);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

const updateEmployerById = asyncHandler(async (req, res) => {
  const { companyName, contactNumber, location, companyDescription ,pincode, foundYear,companyType,state ,fieldWork ,employerId  } = req.body;
  try {
    if (!employerId || !mongoose.Types.ObjectId.isValid(employerId)) {
      return res.status(400).json({ message: "Invalid or missing employer ID" });
    }
    const employer = await Employer.findById(employerId);

    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }

    if (companyName) employer.companyName = companyName;
    if (contactNumber) employer.contactNumber = contactNumber;
    if (pincode) employer.pincode = pincode;
    if (foundYear) employer.foundYear = foundYear;
    if (companyType) employer.companyType = companyType;
    if (fieldWork) employer.fieldWork = fieldWork;
    if (location) employer.location = location;
    if (state) employer.state = state;
    if (companyDescription) employer.companyDescription = companyDescription;

    if (req.file) {
      employer.profileImageUrl = `${IMAGE_UPLOAD_PATH}${req.file.filename}`;
    }
    await employer.save();
    res.json({ success: true, employer });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error processing request" });
  }
});


const registerEmployer = asyncHandler(async (req, res) => {
    const { email, companyName, contactNumber, password} = req.body;

    if (!email || !contactNumber || !companyName || !password) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const otp = generateOTP();
    const otpCreatedAt = new Date();

    const existingEmployer = await Employer.findOne({ email });

    if (existingEmployer) {
      if (!existingEmployer.isVerified) {
        existingEmployer.otp = otp;
        existingEmployer.otpCreatedAt = otpCreatedAt;
        await existingEmployer.save();
        await sendEmail(existingEmployer.email, "Email verification", verifyEmailTemplate(otp, companyName));
        return res.json({ message: `OTP resent to ${existingEmployer.email}` } );
      } else {
        return res.status(400).json({ message: "Email already registered" });
      }
    }


    const employer = await Employer.create({
      email,
      companyName,
      contactNumber,
      password,
      otp,
      otpCreatedAt,
    });

    if (employer) {
      await sendEmail(employer.email, "Email verification", verifyEmailTemplate(otp, companyName));
      res.json({ message: `OTP sent to ${employer.email}`, employer });
    } else {
      res.status(400).json({ message: "Employer registration failed" });
    }
  });

const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  try {
    const employer = await Employer.findOne({ email });
    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }

    const otpAge = (new Date() - employer.otpCreatedAt) / 1000;
    if (otpAge > OTP_EXPIRY_TIME) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (employer.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    employer.otp = null;
    employer.otpCreatedAt = null;
    employer.isVerified = true;
    await employer.save();

    res.json({ message: "OTP verified successfully" , employerId: employer._id, });
    
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const signinEmployer = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const employer = await Employer.findOne({ email });
    if (!employer || !employer.isVerified) {
      return res.status(400).json({ message: "Employer not registered or not verified" });
    }

    const validPassword = await employer.comparePassword(password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken({ id: employer._id.toString() , role: employer.role, email: employer.email, name: employer.companyName});
    res.json({ token, message: "Login successful" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const employer = await Employer.findOne({ email });
    if (!employer) {
      return res.status(404).json({ message: "User not found" });
    }

    if (employer.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    const otp = generateOTP();
    employer.otp = otp;
    employer.otpCreatedAt = new Date();
    await employer.save();

    await sendEmail(employer.email, "Email verification", verifyEmailTemplate(otp, employer.companyName));
    res.json({ message: `OTP resent to email ${employer.email}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = {
  getEmployerById,
  updateEmployerById,
  registerEmployer,
  verifyOTP,
  signinEmployer,
  getEmployerdetails,
  resendOTP
};
