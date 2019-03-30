const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')

const postRoutes = require('./routes/posts.js')
const userRoutes = require('./routes/user.js')

const app = express()

mongoose
  .connect('mongodb+srv://vg:vqyZivBSjeG1gXQ6@nbu0-oe2li.mongodb.net/mean-posts?retryWrites=true', { useNewUrlParser: true, useCreateIndex: true })
  .then(() => {
    console.log('Connected to database.')
  })
  .catch(error => {
    console.error('Error connecting to database: ' + error)
    process.exit(1)
  })

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/images', express.static(path.join('server/images')))
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
  next()
})

app.use('/api/posts', postRoutes)
app.use('/api/user', userRoutes)

module.exports = app
