const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Path `name` is required.'],
  },
  email: {
    type: String,
    required: [true, 'Path `email` is required.'],
    unique: true, 
  },
  password: {
    type: String,
    required: [true, 'Path `password` is required.'],
    minlength: 6, 
  },
  role:{
    type:String,
    default:'admin'
  }
}, {
  timestamps: true,
});

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);