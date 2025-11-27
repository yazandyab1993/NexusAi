const AIModel = require('../models/AIModel');

const getAllModels = async (req, res) => {
  try {
    const models = await AIModel.findAll();
    res.status(200).json(models);
  } catch (error) {
    console.error('Get all models error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllModelsForAdmin = async (req, res) => {
  try {
    const models = await AIModel.findAllForAdmin();
    res.status(200).json(models);
  } catch (error) {
    console.error('Get all models for admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getModelById = async (req, res) => {
  try {
    const { id } = req.params;
    const model = await AIModel.findById(id);
    
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }
    
    res.status(200).json(model);
  } catch (error) {
    console.error('Get model by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createModel = async (req, res) => {
  try {
    const { name, type, description, cost_per_generation, status, thumbnail_url, api_endpoint } = req.body;
    
    // Validate required fields
    if (!name || !type || cost_per_generation === undefined) {
      return res.status(400).json({ message: 'Name, type, and cost_per_generation are required' });
    }
    
    const newModel = await AIModel.create({
      name,
      type,
      description,
      cost_per_generation,
      status: status || 'active',
      thumbnail_url,
      api_endpoint
    });
    
    res.status(201).json({
      message: 'Model created successfully',
      model: newModel
    });
  } catch (error) {
    console.error('Create model error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateModel = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, description, cost_per_generation, status, thumbnail_url, api_endpoint } = req.body;
    
    const updatedModel = await AIModel.update(id, {
      name,
      type,
      description,
      cost_per_generation,
      status,
      thumbnail_url,
      api_endpoint
    });
    
    if (!updatedModel) {
      return res.status(404).json({ message: 'Model not found' });
    }
    
    res.status(200).json({
      message: 'Model updated successfully',
      model: updatedModel
    });
  } catch (error) {
    console.error('Update model error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteModel = async (req, res) => {
  try {
    const { id } = req.params;
    
    const model = await AIModel.findById(id);
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }
    
    await AIModel.delete(id);
    
    res.status(200).json({ message: 'Model deleted successfully' });
  } catch (error) {
    console.error('Delete model error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllModels,
  getAllModelsForAdmin,
  getModelById,
  createModel,
  updateModel,
  deleteModel
};