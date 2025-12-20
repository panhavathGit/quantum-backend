const config = require('../config');

/**
 * Centralized error handling middleware
 * @param {Error} err - Error object
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error:', err.message);
  if (config.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Check if error is from axios (Python service error)
  if (err.response) {
    // Python service returned an error
    return res.status(err.response.status || 500).json({
      error: err.response.data?.error || 'Encryption service error'
    });
  }

  // Check if error is from axios request (Python service unavailable)
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    return res.status(503).json({
      error: 'Encryption service unavailable'
    });
  }

  // Default error response
  res.status(500).json({
    error: config.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
};

module.exports = errorHandler;
