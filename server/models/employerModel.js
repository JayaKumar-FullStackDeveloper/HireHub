const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');


const EmployerSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: Number,
      required: true,
    },
    pincode: {
      type: Number
    },
    foundYear: {
      type: Number
    },
    location: {
      type: String,
    },
    fieldWork: {
      type: String,
    },
    companyType: {
      type: String,
    },
    state: {
      type: String
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
    },
    otpCreatedAt: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "employer",
    },
    profileImageUrl: {
      type: String,
    },
    companyDescription: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);
EmployerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

EmployerSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const Employer = mongoose.model("Employer", EmployerSchema);

module.exports = Employer;