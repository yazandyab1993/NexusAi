const express = require('express');
const router = express.Router();
const { 
  getUserTransactions, 
  getAllTransactions, 
  getUserTransactionSummary 
} = require('../controllers/transactionController');
const { authenticate, authorizeAdmin } = require('../utils/auth');

// Protected routes
router.get('/user/:userId', authenticate, getUserTransactions);
router.get('/user/:userId/summary', authenticate, getUserTransactionSummary);

// Admin routes
router.get('/', authenticate, authorizeAdmin, getAllTransactions);

module.exports = router;