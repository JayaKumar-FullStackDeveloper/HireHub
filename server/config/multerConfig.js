// 

const { put } = require('@vercel/blob');
const path = require('path');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory buffer to upload to Vercel Blob
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|docx|jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only .pdf, .docx, .jpeg, .jpg, .png, and .gif files are allowed.'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Upload file to Vercel Blob in your route
const uploadToVercelBlob = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    const folder = /jpeg|jpg|png|gif/.test(req.file.mimetype)
      ? 'images/profile/'
      : 'uploads/resumes/';

    const fileName = `${Date.now()}-${req.file.originalname}`;
    const { url } = await put(`${folder}${fileName}`, req.file.buffer, {
      access: 'public', // or 'private' as needed
    });

    res.status(200).json({ message: 'File uploaded successfully.', fileUrl: url });
  } catch (error) {
    res.status(500).json({ error: 'File upload failed.', details: error.message });
  }
};

module.exports = { upload, uploadToVercelBlob };