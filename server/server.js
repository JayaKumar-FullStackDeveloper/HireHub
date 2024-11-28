require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');
const companyRoutes = require('./routes/companyRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const path = require('path');

const app = express();
app.use(cors({ origin: '*' }));
connectDB();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads/resumes', express.static(path.join(__dirname, 'uploads/resumes')));

app.use('/api/admin', adminRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/candidate', candidateRoutes);


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

