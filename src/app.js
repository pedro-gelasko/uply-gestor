require('dotenv').config()
const express      = require('express')
const helmet       = require('helmet')
const cors         = require('cors')
const path         = require('path')
const routes       = require('./routes')
const errorHandler = require('./middlewares/errorHandler')
const requestLog   = require('./middlewares/requestLogger')
const { notFound } = require('./utils/response')

const app = express()

app.use(helmet())
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(requestLog)

app.use('/uploads', express.static(path.resolve('uploads')))

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'SABORR CRM API running', timestamp: new Date().toISOString() })
})

app.use('/api/v1', routes)

app.use((req, res) => notFound(res, `Rota não encontrada: ${req.method} ${req.originalUrl}`))

app.use(errorHandler)

module.exports = app
