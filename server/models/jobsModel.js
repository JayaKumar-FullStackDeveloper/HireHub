const mongoose = require('mongoose');

const InternshipApplicationSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String, required: true },
    resume: { type: String, required: true },
    passedOut: {
      type: Number,
      required: true,
    },    companyName: { type: String, required: true },
    jobTitle: { type: String, required: true },
    status: { type: String, default: 'Pending' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('JobsApplication', InternshipApplicationSchema);
