const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'unread' }, 
  reply: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
