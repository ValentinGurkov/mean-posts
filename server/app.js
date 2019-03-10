const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
  next()
})

app.post('/api/posts', (req, res) => {
  const post = req.body
  console.log(post)
  res.status(201).json({
    message: 'OK'
  })
})


app.get('/api/posts', (req, res) => {
  const posts = [
    {
      id: '12312312',
      title: 'first post',
      content: 'first content'
    },
    {
      id: '123122213312',
      title: 'sec post',
      content: 'sec content'
    }
  ]
  res.status(200).json({
    message: 'OK',
    posts
  })
})

module.exports = app
