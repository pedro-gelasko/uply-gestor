require('dotenv').config()
const { Pool } = require('pg')
const logger = require('../utils/logger')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
})

pool.on('error', (err) => logger.error(`pg pool error: ${err.message}`))

const query = (text, params) => pool.query(text, params)

const connect = async () => {
  const client = await pool.connect()
  client.release()
}

module.exports = { query, pool, connect }
