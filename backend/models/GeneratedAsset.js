const { pool } = require('../config/database');

class GeneratedAsset {
  constructor(assetData) {
    this.id = assetData.id;
    this.user_id = assetData.user_id;
    this.model_id = assetData.model_id;
    this.prompt = assetData.prompt;
    this.result_url = assetData.result_url;
    this.created_at = assetData.created_at;
    this.cost = assetData.cost;
  }

  // Find all assets for a user
  static async findByUserId(userId) {
    const query = `
      SELECT ga.*, am.name as model_name 
      FROM generated_assets ga
      LEFT JOIN ai_models am ON ga.model_id = am.id
      WHERE ga.user_id = $1 
      ORDER BY ga.created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows.map(row => {
      const asset = new GeneratedAsset(row);
      asset.model_name = row.model_name;
      return asset;
    });
  }

  // Find all assets (for admin)
  static async findAll() {
    const query = `
      SELECT ga.*, u.name as user_name, am.name as model_name 
      FROM generated_assets ga
      LEFT JOIN users u ON ga.user_id = u.id
      LEFT JOIN ai_models am ON ga.model_id = am.id
      ORDER BY ga.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows.map(row => {
      const asset = new GeneratedAsset(row);
      asset.user_name = row.user_name;
      asset.model_name = row.model_name;
      return asset;
    });
  }

  // Find asset by ID
  static async findById(id) {
    const query = `
      SELECT ga.*, u.name as user_name, am.name as model_name 
      FROM generated_assets ga
      LEFT JOIN users u ON ga.user_id = u.id
      LEFT JOIN ai_models am ON ga.model_id = am.id
      WHERE ga.id = $1
    `;
    const result = await pool.query(query, [id]);
    if (result.rows[0]) {
      const asset = new GeneratedAsset(result.rows[0]);
      asset.user_name = result.rows[0].user_name;
      asset.model_name = result.rows[0].model_name;
      return asset;
    }
    return null;
  }

  // Create new asset
  static async create(assetData) {
    const query = `
      INSERT INTO generated_assets (user_id, model_id, prompt, result_url, cost) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `;
    const values = [
      assetData.user_id,
      assetData.model_id,
      assetData.prompt,
      assetData.result_url,
      assetData.cost
    ];
    
    const result = await pool.query(query, values);
    return new GeneratedAsset(result.rows[0]);
  }
}

module.exports = GeneratedAsset;