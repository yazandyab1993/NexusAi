const { pool } = require('../config/database');

class AIModel {
  constructor(modelData) {
    this.id = modelData.id;
    this.name = modelData.name;
    this.type = modelData.type;
    this.description = modelData.description;
    this.cost_per_generation = modelData.cost_per_generation;
    this.status = modelData.status;
    this.thumbnail_url = modelData.thumbnail_url;
    this.api_endpoint = modelData.api_endpoint;
    this.created_at = modelData.created_at;
    this.updated_at = modelData.updated_at;
  }

  // Find all models
  static async findAll() {
    const query = 'SELECT * FROM ai_models WHERE status = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, ['active']);
    return result.rows.map(row => new AIModel(row));
  }

  // Find all models (including inactive) - for admin
  static async findAllForAdmin() {
    const query = 'SELECT * FROM ai_models ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows.map(row => new AIModel(row));
  }

  // Find model by ID
  static async findById(id) {
    const query = 'SELECT * FROM ai_models WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] ? new AIModel(result.rows[0]) : null;
  }

  // Create new model
  static async create(modelData) {
    const query = `
      INSERT INTO ai_models (name, type, description, cost_per_generation, status, thumbnail_url, api_endpoint) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *
    `;
    const values = [
      modelData.name,
      modelData.type,
      modelData.description,
      modelData.cost_per_generation,
      modelData.status || 'active',
      modelData.thumbnail_url,
      modelData.api_endpoint
    ];
    
    const result = await pool.query(query, values);
    return new AIModel(result.rows[0]);
  }

  // Update model
  static async update(id, updateData) {
    const query = `
      UPDATE ai_models 
      SET name = $1, type = $2, description = $3, cost_per_generation = $4, 
          status = $5, thumbnail_url = $6, api_endpoint = $7, updated_at = CURRENT_TIMESTAMP
      WHERE id = $8 
      RETURNING *
    `;
    const values = [
      updateData.name,
      updateData.type,
      updateData.description,
      updateData.cost_per_generation,
      updateData.status,
      updateData.thumbnail_url,
      updateData.api_endpoint,
      id
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0] ? new AIModel(result.rows[0]) : null;
  }

  // Delete model
  static async delete(id) {
    const query = 'DELETE FROM ai_models WHERE id = $1';
    await pool.query(query, [id]);
    return true;
  }
}

module.exports = AIModel;