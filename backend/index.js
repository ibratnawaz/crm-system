require('dotenv').config()
const express = require('express')
const colors = require('colors')
const connectDB = require('./config/db')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

const userRoutes = require('./routes/userRoutes')

const port = process.env.PORT || 5000

// Connect Database
connectDB()

const app = express()
app.use(express.json())

// Define Routes
app.use('/api/users', userRoutes)

app.get('/', (req, res) => {
  res.send('server is running...')
})

app.use(notFound)
app.use(errorHandler)

app.listen(port, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${port}`.yellow.bold
  )
)
