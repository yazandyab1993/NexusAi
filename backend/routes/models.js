const express = require('express');
const router = express.Router();
const { 
  getAllModels, 
  getAllModelsForAdmin,
  getModelById, 
  createModel, 
  updateModel, 
  deleteModel 
} = require('../controllers/modelController');
const { authenticate, authorizeAdmin } = require('../utils/auth');

// Public route - get active models
router.get('/', getAllModels);

// Protected routes
router.get('/admin', authenticate, authorizeAdmin, getAllModelsForAdmin);
router.get('/:id', authenticate, getModelById);

// Admin routes
router.post('/', authenticate, authorizeAdmin, createModel);
router.put('/:id', authenticate, authorizeAdmin, updateModel);
router.delete('/:id', authenticate, authorizeAdmin, deleteModel);

module.exports = router;