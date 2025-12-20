const express = require('express');
const axios = require('axios');
const config = require('../config');

const router = express.Router();

// Proxy encryption request to Python service
router.post('/encrypt', async (req, res, next) => {
  try {
    const response = await axios.post(`${config.PYTHON_SERVICE_URL}/api/encrypt`, req.body);
    res.json(response.data);
  } catch (error) {
    next(error);
  }
});

// Proxy decryption request to Python service
router.post('/decrypt', async (req, res, next) => {
  try {
    const response = await axios.post(`${config.PYTHON_SERVICE_URL}/api/decrypt`, req.body);
    res.json(response.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
