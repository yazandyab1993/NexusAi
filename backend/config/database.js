const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'nexusai_studio',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// Initialize database tables
const initializeDatabase = async () => {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        role VARCHAR(20) DEFAULT 'USER',
        credits INTEGER DEFAULT 0,
        avatar_url TEXT,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      )
    `);

    // Create ai_models table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ai_models (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        description TEXT,
        cost_per_generation INTEGER DEFAULT 0,
        status VARCHAR(20) DEFAULT 'active',
        thumbnail_url TEXT,
        api_endpoint TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create transactions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(20) NOT NULL CHECK (type IN ('DEPOSIT', 'SPEND')),
        amount INTEGER NOT NULL,
        description TEXT,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'completed'
      )
    `);

    // Create generated_assets table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS generated_assets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        model_id INTEGER REFERENCES ai_models(id) ON DELETE CASCADE,
        prompt TEXT NOT NULL,
        result_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        cost INTEGER NOT NULL
      )
    `);

    // Create indexes for better performance
    await pool.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_assets_user_id ON generated_assets(user_id);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_assets_model_id ON generated_assets(model_id);');

    console.log('Database initialized successfully');
    
    // Insert default admin user if not exists
    const adminCheck = await pool.query('SELECT * FROM users WHERE email = $1', ['admin@nexus.ai']);
    if (adminCheck.rows.length === 0) {
      const insertAdmin = `
        INSERT INTO users (name, email, role, credits) 
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `;
      await pool.query(insertAdmin, ['System Admin', 'admin@nexus.ai', 'ADMIN', 99999]);
      console.log('Default admin user created: admin@nexus.ai');
    }

    // Insert default models if not exists
    const modelsCheck = await pool.query('SELECT * FROM ai_models LIMIT 1');
    if (modelsCheck.rows.length === 0) {
      const insertModels = `
        INSERT INTO ai_models (name, type, description, cost_per_generation, status, thumbnail_url) 
        VALUES 
          ($1, $2, $3, $4, $5, $6),
          ($7, $8, $9, $10, $11, $12),
          ($13, $14, $15, $16, $17, $18)
      `;
      await pool.query(insertModels, [
        'Freepik Motion V1', 'Text to Video', 'Generate high-quality 5s videos from text prompts.', 50, 'active', 'https://picsum.photos/400/225?random=1',
        'Freepik Animate Pro', 'Image to Video', 'Bring static images to life with subtle motion.', 80, 'active', 'https://picsum.photos/400/225?random=2',
        'Freepik Flux Realism', 'Text to Image', 'Hyper-realistic image generation.', 10, 'active', 'https://picsum.photos/400/225?random=3'
      ]);
      console.log('Default AI models created');
    }

  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

module.exports = {
  pool,
  initializeDatabase
};