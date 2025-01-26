process.chdir(__dirname);
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const loadRoutes = require('./routes/loadRoutes');
const lookupRoutes = require('./routes/lookupRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const jobRoutes = require('./routes/jobRoutes');
const systemRoutes = require('./routes/systemRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const companyRoutes = require('./routes/companyRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api/loads', loadRoutes);
app.use('/api/lookups', lookupRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/vehicles', vehicleRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
