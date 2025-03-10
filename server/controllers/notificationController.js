const adminModels = require('../models/adminModels');
const Notification = require('../models/notificationModel');
const nodemailer = require('nodemailer');

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

const replyToNotification = async (req, res) => {
  const { id } = req.params;
  const { reply , adminId } = req.body;
  try {
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, 
      to: notification.email,
      subject: `Reply from HireHub Admin: ${notification.subject}`,
      text: reply,
    };

    await transporter.sendMail(mailOptions);

    notification.status = 'replied';
    notification.reply = reply;
    await notification.save();
    if (adminId) {
      logAdminActivity(adminId, `Reply a message to ${notification.username}in  email ${notification.email}`);
    } else {
      console.log('No adminId found in request');
    }
    res.status(200).json({ message: 'Reply sent and notification updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while replying' });
  }
};

const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching notifications' });
  }
};

const createNotification = async (req, res) => {
    const { username, email, subject, message } = req.body;
  
    try {
      if (!username || !email || !subject || !message) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      const notification = new Notification({
        username,
        email,
        subject,
        message,
        status: 'Unread',
      });
  
      const savedNotification = await notification.save();
  
      res.status(201).json({
        message: 'Notification created successfully',
        notification: savedNotification,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while creating the notification' });
    }
  };

module.exports = {
  replyToNotification,
  getAllNotifications,
  createNotification
};
