require('dotenv').config();
const isLoggingEnabled = String(process.env.LOGGING || '').trim().toLowerCase() === 'true';

console.log('LOGGING value:', process.env.LOGGING);

const logger = {
  log: (...args) => {
    if (isLoggingEnabled) {
      console.log(...args);
    }
  },
};

module.exports = logger;