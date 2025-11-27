const { pool } = require('../config/database');

class Transaction {
  constructor(transactionData) {
    this.id = transactionData.id;
    this.user_id = transactionData.user_id;
    this.type = transactionData.type;
    this.amount = transactionData.amount;
    this.description = transactionData.description;
    this.date = transactionData.date;
    this.status = transactionData.status;
  }

  // Find all transactions for a user
  static async findByUserId(userId) {
    const query = 'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC';
    const result = await pool.query(query, [userId]);
    return result.rows.map(row => new Transaction(row));
  }

  // Find all transactions (for admin)
  static async findAll() {
    const query = 'SELECT * FROM transactions ORDER BY date DESC';
    const result = await pool.query(query);
    return result.rows.map(row => new Transaction(row));
  }

  // Create new transaction
  static async create(transactionData) {
    const query = `
      INSERT INTO transactions (user_id, type, amount, description, status) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `;
    const values = [
      transactionData.user_id,
      transactionData.type,
      transactionData.amount,
      transactionData.description,
      transactionData.status || 'completed'
    ];
    
    const result = await pool.query(query, values);
    return new Transaction(result.rows[0]);
  }

  // Get user's transaction summary
  static async getUserSummary(userId) {
    const query = `
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'DEPOSIT' THEN amount ELSE 0 END), 0) as total_deposited,
        COALESCE(SUM(CASE WHEN type = 'SPEND' THEN amount ELSE 0 END), 0) as total_spent,
        (COALESCE(SUM(CASE WHEN type = 'DEPOSIT' THEN amount ELSE 0 END), 0) - 
         COALESCE(SUM(CASE WHEN type = 'SPEND' THEN amount ELSE 0 END), 0)) as current_balance
      FROM transactions 
      WHERE user_id = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }
}

module.exports = Transaction;