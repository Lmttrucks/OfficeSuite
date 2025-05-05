require('dotenv').config(); // Load environment variables first
process.chdir(__dirname);
const appInsights = require('applicationinsights');

if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
  try {
    appInsights
      .setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || process.env.APPINSIGHTS_INSTRUMENTATIONKEY)
      .setAutoCollectConsole(true, true)
      .setAutoCollectDependencies(true)
      .setAutoCollectExceptions(true)
      .setAutoCollectPerformance(true)
      .setAutoCollectRequests(true)
      .start();
  } catch (error) {
    console.error('Application Insights initialization failed:', error.message);
  }
} else {
  console.warn("No instrumentation key or connection string provided for Application Insights.");
}

const express = require('express');
const cors = require('cors');
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
const axios = require('axios'); // Import axios for pinging the API

const app = express();
const port = process.env.PORT || 8080; // Ensure the app listens on port 8080

app.use(cors({ origin: '*' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
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

// Health check endpoint
app.get('/api/ping', (req, res) => {
  res.send('Here!');
});

// Start the server
app.listen(port, async () => {
  logger.log(`Server running on port ${port}`);

  // Ping the health check endpoint on startup
  try {
    const response = await axios.get(`http://localhost:${port}/api/ping`);
    logger.log(`Health check response: ${response.data}`);
  } catch (error) {
    logger.error('Health check failed:', error.message);
  }
});
