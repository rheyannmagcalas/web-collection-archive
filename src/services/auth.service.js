import bcrypt from 'bcrypt'
import pool from '../config/db.js'

export const findUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  )
  return result.rows[0]
}

export const createUser = async (username, email, password) => {
  const hashed = await bcrypt.hash(password, 10)
  await pool.query(
    'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
    [username, email, hashed]
  )
}

export const findUserById = async (id) => {
  const result = await pool.query(
    'SELECT id, username, email FROM users WHERE id = $1',
    [id]
  )

  return result.rows[0]
}