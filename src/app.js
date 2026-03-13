import 'dotenv/config'
import express from 'express'
import session from 'express-session'
import pgSession from 'connect-pg-simple'
import helmet from 'helmet'
import morgan from 'morgan'
import pool from './config/db.js'
import authRoutes from './routes/auth.routes.js'

const app = express()

const PgSession = pgSession(session)

app.set('view engine', 'ejs')
app.set('views', './src/views')

app.use(helmet())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))

app.use(
  session({
    store: new PgSession({
      pool: pool,
      tableName: 'session',
      createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
)

app.use(authRoutes)

export default app