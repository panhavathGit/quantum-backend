require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3001,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  PYTHON_SERVICE_URL: process.env.PYTHON_SERVICE_URL || 'http://localhost:5001',
  NODE_ENV: process.env.NODE_ENV || 'development'
};
