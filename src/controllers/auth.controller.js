import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import { 
  findUserByEmail, 
  createUser,
  findUserById 
} from '../services/auth.service.js'

export const getLogin = (req, res) => {
  res.render('login', { error: null })
}

export const postLogin = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.render('login', { error: errors.array()[0].msg })

  const { email, password } = req.body
  const user = await findUserByEmail(email)
  if (!user) return res.render('login', { error: 'User not found' })

  const match = await bcrypt.compare(password, user.password)
  if (!match) return res.render('login', { error: 'Invalid password' })

  req.session.userId = user.id
  res.redirect('/home')
}

// === Register ===
export const getRegister = (req, res) => {
  res.render('register', { error: null })
}

export const postRegister = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.render('register', { error: errors.array()[0].msg })

  const { username, email, password, confirmPassword } = req.body

  if (password !== confirmPassword) return res.render('register', { error: 'Passwords do not match' })

  const existingUser = await findUserByEmail(email)
  if (existingUser) return res.render('register', { error: 'Email already registered' })

  await createUser(username, email, password)

  // Auto-login after register
  const user = await findUserByEmail(email)
  req.session.userId = user.id
  res.redirect('/home')
}

export const getHome = async (req, res) => {
  const user = await findUserById(req.session.userId)

  res.render('home', {
    username: user.username
  })
}

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login')
  })
}