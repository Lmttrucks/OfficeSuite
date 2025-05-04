require('dotenv').config(); // Load environment variables first
process.chdir(__dirname);
const express = require('express');
const cors = require('cors');
const path = require('path'); // Import path module
const logger = require('./utils/logger'); // Import logger after dotenv
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
const linkLoadsRoutes = require('./routes/linkLoadsRoutes');
const ratesRoute = require('./routes/ratesRoute');
const appInsights = require('applicationinsights');
appInsights.setup().start();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
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
app.use('/api/link-loads', linkLoadsRoutes);
app.use('/api/rates', ratesRoute);

// Serve static files from the frontend's build folder
app.use(express.static(path.join(__dirname, '../build')));

// Catch-all route to serve the React app for any unmatched routes
app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'), (err) => {
        if (err) {
            logger.error('Error serving index.html:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

app.listen(port, () => {
    logger.log(`Server running on port ${port}`);
});
