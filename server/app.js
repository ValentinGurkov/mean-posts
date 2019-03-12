const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const Post = require('./models/post')

const app = express()

mongoose.connect('mongodb+srv://vg:vqyZivBSjeG1gXQ6@nbu0-oe2li.mongodb.net/mean-posts?retryWrites=true', { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to database.')
  })
  .catch(error => {
    console.error('Error connecting to database: ' + error)
    process.exit(1)
  })

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
  next()
})

app.post('/api/posts', (req, res) => {
  const post = new Post(req.body)
  post.save()
    .then( savedPost => {
      res.status(201).json({
        message: 'OK',
        id: savedPost._id
      })
    })
})


app.get('/api/posts', (req, res) => {
  Post.find()
    .then(documents => {
      let posts = []
      documents.map(post => posts.push({
        id: post._id,
        title: post.title,
        content: post.content
      }))
      res.status(200).json({
        message: 'OK',
        posts
      })
    })
})

app.patch('/api/posts/:id', (req, res) => {
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content
  })
  Post.updateOne({ _id: req.params.id}, post)
    .then( () => {
      res.status(200).json({ message: 'Post updated. '})
    })
    .catch(error => {
      console.error('Error updating post in database: ' + error)
    })
})

app.delete('/api/posts/:id', (req, res) => {
  Post.deleteOne({ _id: req.params.id})
    .then( () => {
      res.status(200).json({ message: 'Post deleted. '})
    })
    .catch(error => {
      console.error('Error deleting post in database: ' + error)
    })
})

module.exports = app
