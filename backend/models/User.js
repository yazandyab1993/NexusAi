const { pool } = require('../config/database');

class User {
  constructor(userData) {
    this.id = userData.id;
    this.name = userData.name;
    this.email = userData.email;
    this.password_hash = userData.password_hash;
    this.role = userData.role || 'USER';
    this.credits = userData.credits || 0;
    this.avatar_url = userData.avatar_url;
    this.joined_at = userData.joined_at;
    this.last_login = userData.last_login;
  }

  // Find user by ID
  static async findById(id) {
    const query = 'SELECT id, name, email, role, credits, avatar_url, joined_at, last_login FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] ? new User(result.rows[0]) : null;
  }

  // Find user by email
  static async findByEmail(email) {
    const query = 'SELECT id, name, email, password_hash, role, credits, avatar_url, joined_at, last_login FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] ? new User(result.rows[0]) : null;
  }

  // Create new user
  static async create(userData) {
    const query = `
      INSERT INTO users (name, email, password_hash, role, credits, avatar_url) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING id, name, email, role, credits, avatar_url, joined_at
    `;
    const values = [
      userData.name,
      userData.email,
      userData.password_hash,
      userData.role || 'USER',
      userData.credits || 0,
      userData.avatar_url || null
    ];
    
    const result = await pool.query(query, values);
    return new User(result.rows[0]);
  }

  // Update user credits
  static async updateCredits(userId, newCredits) {
    const query = 'UPDATE users SET credits = $1 WHERE id = $2 RETURNING id, name, email, role, credits, avatar_url, joined_at';
    const result = await pool.query(query, [newCredits, userId]);
    return result.rows[0] ? new User(result.rows[0]) : null;
  }

  // Add credits to user
  static async addCredits(userId, amount) {
    const query = 'UPDATE users SET credits = credits + $1 WHERE id = $2 RETURNING id, name, email, role, credits, avatar_url, joined_at';
    const result = await pool.query(query, [amount, userId]);
    return result.rows[0] ? new User(result.rows[0]) : null;
  }

  // Get all users (for admin panel)
  static async getAll() {
    const query = 'SELECT id, name, email, role, credits, joined_at FROM users ORDER BY joined_at DESC';
    const result = await pool.query(query);
    return result.rows.map(row => new User(row));
  }

  // Update last login time
  static async updateLastLogin(userId) {
    const query = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1';
    await pool.query(query, [userId]);
  }
}

module.exports = User;