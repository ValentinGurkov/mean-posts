const express = require('express')
const Post = require('../models/post')

const router = express.Router()

router.post('', (req, res) => {
  const post = new Post(req.body)
  post.save()
    .then( savedPost => {
      res.status(201).json({
        message: 'OK',
        id: savedPost._id
      })
    })
})

router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post)
      } else {
        res.status(404).json({ message: 'Post not found'})
      }
    })
})

router.get('', (req, res) => {
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

router.patch('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
  Post.deleteOne({ _id: req.params.id})
    .then( () => {
      res.status(200).json({ message: 'Post deleted. '})
    })
    .catch(error => {
      console.error('Error deleting post in database: ' + error)
    })
})

module.exports = router
