const Transaction = require('../models/Transaction');

const getUserTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify that the requesting user is either the target user or an admin
    if (req.user.id !== parseInt(userId) && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const transactions = await Transaction.findByUserId(userId);
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Get user transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll();
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Get all transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserTransactionSummary = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify that the requesting user is either the target user or an admin
    if (req.user.id !== parseInt(userId) && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const summary = await Transaction.getUserSummary(userId);
    res.status(200).json(summary);
  } catch (error) {
    console.error('Get user transaction summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserTransactions,
  getAllTransactions,
  getUserTransactionSummary
};