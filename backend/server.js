import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import cors from 'cors'

import rateLimit from 'express-rate-limit'
import path from 'path'
import { fileURLToPath } from 'url'

import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import jobRoutes from './routes/jobs.js'
//import aiRoutes from './routes/ai.js'
import router from './routes/ai.js'


// checking  pid to know file are interconnected or connecting to another app file
const __filename = fileURLToPath(import.meta.url)
//console.log("server file", __filename)
// console.log("PID:",process.pid);


const __dirname = path.dirname(__filename)

const app = express()
const httpServer = createServer(app)

// Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:1573',
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id))
})




// Make io accessible in routes
app.set('io', io)

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))



// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: 'Too many requests, please try again later.' },
})
app.use('/api/', limiter)

// Stricter limit for AI routes (they cost money)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { message: 'AI request limit reached. Please wait a moment.' },
})
app.use('/api/ai', aiLimiter)



// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/ai', router)

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})
//test  route
app.get("/",(req,res)=> {
  res.send("Backend running");
})
// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))



// search , Jsearch


// Connect DB and start server
const PORT = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    httpServer.listen(PORT, () => {
      console.log(`🚀 JobSaathi server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message)
    process.exit(1)
  })

export default app
