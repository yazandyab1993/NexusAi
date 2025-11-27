const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  getUserById, 
  addCredits, 
  updateUser 
} = require('../controllers/userController');
const { authenticate, authorizeAdmin } = require('../utils/auth');

// Public route for current user (requires authentication)
router.get('/me', authenticate, getUserById);

// Admin routes
router.get('/', authenticate, authorizeAdmin, getAllUsers);
router.get('/:id', authenticate, authorizeAdmin, getUserById);
router.put('/:id/credits', authenticate, authorizeAdmin, addCredits);
router.put('/:id', authenticate, authorizeAdmin, updateUser);

module.exports = router;