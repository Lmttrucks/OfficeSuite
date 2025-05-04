require('dotenv').config(); // Load environment variables first
process.chdir(__dirname);
const appInsights = require('applicationinsights');

if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
  appInsights
    .setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || process.env.APPINSIGHTS_INSTRUMENTATIONKEY)
    .setAutoCollectConsole(true, true)
    .setAutoCollectDependencies(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectRequests(true)
    .start();
} else {
  console.warn("No instrumentation key or connection string provided for Application Insights.");
}

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

const app = express();
const port = process.env.PORT || 5000;

// Middleware to log requests (optional)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

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
const frontendPath = path.join(__dirname, '../frontend/build');
app.use(express.static(frontendPath));

// Catch-all route to serve the React app for any unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(port, () => {
  logger.log(`Server running on port ${port}`);
});
