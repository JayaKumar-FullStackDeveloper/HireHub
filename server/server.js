require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');
const companyRoutes = require('./routes/companyRoutes');

const app = express();
app.use(cors({ origin: '*' }));
connectDB();

app.use(express.json());

app.use('/api/admin', adminRoutes);
app.use('/api/companies', companyRoutes);


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

