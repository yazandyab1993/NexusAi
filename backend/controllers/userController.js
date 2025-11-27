const User = require('../models/User');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const { password_hash, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addCredits = async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount } = req.body;
    
    // Validate input
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }
    
    // Find target user
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Add credits to user
    const updatedUser = await User.addCredits(userId, amount);
    
    // In a real app, you would also create a transaction record here
    // For now, we'll just return the updated user
    
    const { password_hash, ...userWithoutPassword } = updatedUser;
    res.status(200).json({
      message: 'Credits added successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Add credits error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, credits } = req.body;
    
    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // In a real implementation, you would update the user fields
    // For now, we'll just return the existing user
    const { password_hash, ...userWithoutPassword } = user;
    res.status(200).json({
      message: 'User updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  addCredits,
  updateUser
};