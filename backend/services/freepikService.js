const axios = require('axios');

class FreepikService {
  constructor() {
    this.apiKey = process.env.FREEPIK_API_KEY;
    this.baseUrl = process.env.FREEPIK_BASE_URL || 'https://api.freepik.com';
  }

  // Text to Video generation
  async textToVideo(prompt, options = {}) {
    try {
      if (!this.apiKey) {
        throw new Error('Freepik API key is not configured');
      }

      // This is a placeholder implementation
      // In a real implementation, you would call the actual Freepik API
      const response = await axios.post(
        `${this.baseUrl}/v1/video/text-to-video`,
        {
          prompt,
          ...options
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000 // 30 seconds timeout
        }
      );

      return response.data;
    } catch (error) {
      console.error('Freepik text-to-video error:', error.message);
      throw error;
    }
  }

  // Image to Video generation
  async imageToVideo(imageUrl, prompt, options = {}) {
    try {
      if (!this.apiKey) {
        throw new Error('Freepik API key is not configured');
      }

      // This is a placeholder implementation
      // In a real implementation, you would call the actual Freepik API
      const response = await axios.post(
        `${this.baseUrl}/v1/video/image-to-video`,
        {
          image_url: imageUrl,
          prompt,
          ...options
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000 // 30 seconds timeout
        }
      );

      return response.data;
    } catch (error) {
      console.error('Freepik image-to-video error:', error.message);
      throw error;
    }
  }

  // Text to Image generation
  async textToImage(prompt, options = {}) {
    try {
      if (!this.apiKey) {
        throw new Error('Freepik API key is not configured');
      }

      // This is a placeholder implementation
      // In a real implementation, you would call the actual Freepik API
      const response = await axios.post(
        `${this.baseUrl}/v1/image/text-to-image`,
        {
          prompt,
          ...options
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000 // 30 seconds timeout
        }
      );

      return response.data;
    } catch (error) {
      console.error('Freepik text-to-image error:', error.message);
      throw error;
    }
  }

  // Check generation status
  async checkStatus(taskId) {
    try {
      if (!this.apiKey) {
        throw new Error('Freepik API key is not configured');
      }

      const response = await axios.get(
        `${this.baseUrl}/v1/task/${taskId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Freepik check status error:', error.message);
      throw error;
    }
  }
}

module.exports = new FreepikService();