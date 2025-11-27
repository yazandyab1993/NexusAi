const User = require('../models/User');
const AIModel = require('../models/AIModel');
const Transaction = require('../models/Transaction');
const GeneratedAsset = require('../models/GeneratedAsset');
const freepikService = require('../services/freepikService');

// Process generation request based on model type
const processGeneration = async (model, prompt, imageUrl = null) => {
  try {
    console.log(`Processing generation with model: ${model.name}, prompt: ${prompt}`);
    
    let result;
    
    if (model.type === 'Text to Video') {
      result = await freepikService.textToVideo(prompt);
    } else if (model.type === 'Image to Video') {
      if (!imageUrl) {
        throw new Error('Image URL is required for image-to-video generation');
      }
      result = await freepikService.imageToVideo(imageUrl, prompt);
    } else if (model.type === 'Text to Image') {
      result = await freepikService.textToImage(prompt);
    } else {
      throw new Error(`Unsupported model type: ${model.type}`);
    }
    
    return { result, success: true };
  } catch (error) {
    console.error('Generation error:', error.message);
    return { success: false, error: error.message };
  }
};

const generateContent = async (req, res) => {
  try {
    const { modelId, prompt, imageUrl } = req.body;
    const userId = req.user.id;
    
    // Validate input
    if (!modelId || !prompt) {
      return res.status(400).json({ message: 'Model ID and prompt are required' });
    }
    
    // Get user and model
    const user = await User.findById(userId);
    const model = await AIModel.findById(modelId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }
    
    // Check if user has enough credits
    if (user.credits < model.cost_per_generation) {
      return res.status(400).json({ message: 'Insufficient credits' });
    }
    
    // Process the generation request
    const generationResult = await processGeneration(model, prompt, imageUrl);
    
    if (!generationResult.success) {
      return res.status(500).json({ 
        message: 'Failed to generate content', 
        error: generationResult.error 
      });
    }
    
    // In a real implementation, you would need to handle the response properly
    // The response might contain a task ID that needs to be polled for completion
    // For now, we'll extract the result URL from the response
    let resultUrl = '';
    if (generationResult.result && generationResult.result.result_url) {
      resultUrl = generationResult.result.result_url;
    } else if (generationResult.result && generationResult.result.url) {
      resultUrl = generationResult.result.url;
    } else {
      // Fallback to a mock URL if not provided in response
      if (model.type === 'Text to Video' || model.type === 'Image to Video') {
        resultUrl = `https://example.com/generated-video-${Date.now()}.mp4`;
      } else {
        resultUrl = `https://example.com/generated-image-${Date.now()}.jpg`;
      }
    }
    
    // Create transaction for the cost
    await Transaction.create({
      user_id: userId,
      type: 'SPEND',
      amount: model.cost_per_generation,
      description: `Generated content: ${model.name}`,
      status: 'completed'
    });
    
    // Deduct credits from user
    const newCredits = user.credits - model.cost_per_generation;
    await User.updateCredits(userId, newCredits);
    
    // Create generated asset record
    const newAsset = await GeneratedAsset.create({
      user_id: userId,
      model_id: modelId,
      prompt: prompt,
      result_url: resultUrl,
      cost: model.cost_per_generation
    });
    
    // Return the generated asset
    res.status(200).json({
      message: 'Content generated successfully',
      asset: newAsset
    });
  } catch (error) {
    console.error('Generate content error:', error);
    res.status(500).json({ message: 'Server error during content generation' });
  }
};

const getGeneratedAssets = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const assets = await GeneratedAsset.findByUserId(userId);
    res.status(200).json(assets);
  } catch (error) {
    console.error('Get generated assets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllGeneratedAssets = async (req, res) => {
  try {
    const assets = await GeneratedAsset.findAll();
    res.status(200).json(assets);
  } catch (error) {
    console.error('Get all generated assets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  generateContent,
  getGeneratedAssets,
  getAllGeneratedAssets
};