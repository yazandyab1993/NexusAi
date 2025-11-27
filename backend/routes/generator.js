const express = require('express');
const router = express.Router();
const { 
  generateContent, 
  getGeneratedAssets,
  getAllGeneratedAssets
} = require('../controllers/generatorController');
const { authenticate, authorizeAdmin } = require('../utils/auth');

// Protected routes
router.post('/generate', authenticate, generateContent);
router.get('/assets', authenticate, getGeneratedAssets);

// Admin routes
router.get('/assets/all', authenticate, authorizeAdmin, getAllGeneratedAssets);

module.exports = router;