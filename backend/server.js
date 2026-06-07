const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

// Simple CORS — allows all origins
// This is fine for development and internship projects
app.use(cors())
app.use(express.json())

app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/tasks', require('./routes/taskRoutes'))

app.get('/', (req, res) => {
  res.json({ message: 'API is running!' })
})

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`))
  })
  .catch((err) => {
    console.error('❌ MongoDB error:', err.message)
    process.exit(1)
  })