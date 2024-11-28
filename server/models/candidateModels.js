const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
const candidateSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    dob: {
      type: Date
    },
    gender: {
      type: String
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    passedOut: {
      type: Number,
      required: true,
    },
    resume: {
      type: String,
    },
    paymentStatus: {
      type: String,
      default: 'Unpaid',
    },
    paymentStatusChangedAt: {
      type: Date,
    },
    age: {
      type: Number
    },
    // password: {
    //   type: String,
    //   // required: true, 
    //   minlength: 8,   
    // },
    joiningDate: {
      type: Date,
      default: Date.now, 
    },
  },
  {
    timestamps: true,
  }
);

candidateSchema.pre('save', async function (next) {
  if (this.isModified('paymentStatus') && this.paymentStatus === 'Paid') {
    this.paymentStatusChangedAt = Date.now();
  }
  // if (this.isModified('password')) {
  //   this.password = await bcrypt.hash(this.password, 10); 
  // }

  next();
});

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
