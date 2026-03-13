import express from 'express'
import { body } from 'express-validator'
import {
  getLogin,
  postLogin,
  getRegister,
  postRegister,
  getHome,
  logout
} from '../controllers/auth.controller.js'
import { isAuthenticated } from '../middleware/auth.middleware.js'

const router = express.Router()

// Login
router.get('/login', getLogin)
router.post(
  '/login',
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password required'),
  postLogin
)

// Register
router.get('/register', getRegister)
router.post(
  '/register',
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
  body('confirmPassword').notEmpty().withMessage('Confirm Password required'),
  postRegister
)

// Home
router.get('/home', isAuthenticated, getHome)
router.get('/logout', logout)

export default router