import pool from '../config/db.js'
import fs from 'fs'
import path from 'path'

export const getFilesPage = async (req, res) => {
    try {
      const userResult = await pool.query(
        'SELECT username FROM users WHERE id = $1',
        [req.session.userId]
      )
      const username = userResult.rows[0].username
  
      const result = await pool.query(
        'SELECT * FROM file_archives WHERE id = $1 ORDER BY created_at DESC',
        [req.session.userId]
      )
  
      res.render('files', {
        username,
        files: result.rows,
        success: null,
        error: null
      })
    } catch (err) {
      console.error(err)
      res.render('files', { 
        username: null, 
        files: [], 
        success: null, 
        error: 'Could not fetch files' 
      })
    }
  }

  export const uploadFile = async (req, res) => {
    try {
      const file = req.file
      if (!file) throw new Error('No file uploaded')
  
      await pool.query(
        'INSERT INTO file_archives (user_id, filename, original_name) VALUES ($1, $2, $3)',
        [req.session.userId, file.filename, file.originalname]
      )
  
      const result = await pool.query(
        'SELECT * FROM file_archives WHERE user_id = $1 ORDER BY created_at DESC',
        [req.session.userId]
      )
  
      res.render('files', {
        username: req.session.username,
        files: result.rows,
        success: 'File uploaded successfully',
        error: null
      })
  
    } catch (err) {
      const result = await pool.query(
        'SELECT * FROM file_archives WHERE user_id = $1 ORDER BY created_at DESC',
        [req.session.userId]
      )
      res.render('files', {
        username: req.session.username,
        files: result.rows,
        success: null,
        error: err.message
      })
    }
  }

export const downloadFile = (req, res) => {
  const { filename } = req.params
  const filePath = path.join(process.cwd(), 'uploads', filename)

  if (!fs.existsSync(filePath)) return res.status(404).send('File not found')
  res.download(filePath)
}

export const deleteFile = async (req, res) => {
    const { id } = req.params
  
    try {
      const result = await pool.query(
        'SELECT filename FROM file_archives WHERE id = $1 AND user_id = $2',
        [id, req.session.userId]
      )
  
      if (!result.rows.length) {
        throw new Error('File not found or not authorized')
      }
  
      const filename = result.rows[0].filename
      const filePath = path.join(process.cwd(), 'uploads', filename)
  
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  
      await pool.query('DELETE FROM file_archives WHERE id = $1', [id])
  
      // Fetch remaining files
      const filesResult = await pool.query(
        'SELECT * FROM file_archives WHERE user_id = $1 ORDER BY created_at DESC',
        [req.session.userId]
      )
  
      res.render('files', {
        username: req.session.username,
        files: filesResult.rows,
        success: 'File deleted successfully',
        error: null
      })
  
    } catch (err) {
      console.error(err)
      const filesResult = await pool.query(
        'SELECT * FROM file_archives WHERE user_id = $1 ORDER BY created_at DESC',
        [req.session.userId]
      )
  
      res.render('files', {
        username: req.session.username,
        files: filesResult.rows,
        success: null,
        error: err.message
      })
    }
  }