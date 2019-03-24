const express = require('express')
const multer = require('multer')
const Post = require('../models/post')

const router = express.Router()

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype]
    let error = isValid ? null : new Error('Invalid MIME type')
    callback(error, 'server/images')
  },
  filename: (req, file, callback) => {
    const name = file.originalname
      .toLowerCase()
      .split(' ')
      .join('-')
    const ext = MIME_TYPE_MAP[file.mimetype]
    callback(null, name + '-' + Date.now() + '.' + ext)
  }
})

router.post('', multer({ storage }).single('image'), (req, res) => {
  const url = req.protocol + '://' + req.get('host')
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename
  })
  post.save().then(savedPost => {
    res.status(201).json({
      message: 'OK',
      id: savedPost._id,
      title: savedPost.title,
      content: savedPost.content,
      imagePath: savedPost
    })
  })
})

router.get('/:id', (req, res) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post)
    } else {
      res.status(404).json({ message: 'Post not found' })
    }
  })
})

router.get('', (req, res) => {
  const pageSize = +req.query.size
  const currentPage = +req.query.page
  const postQuery =  Post.find()
  let fetchedPosts
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize)
  }
  postQuery.then(documents => {
    fetchedPosts = documents
    return Post.countDocuments()
  }).then(count => {
    let posts = []
    fetchedPosts.map(post =>
      posts.push({
        id: post._id,
        title: post.title,
        content: post.content,
        imagePath: post.imagePath
      })
    )
    res.status(200).json({
      message: 'OK',
      maxPosts: count,
      posts
    })
  })
})

router.patch('/:id', multer({ storage }).single('image'), (req, res) => {
  let imagePath = req.body.imagePath
  if (req.file) {
    const url = req.protocol + '://' + req.get('host')
    imagePath = url + '/images/' + req.file.filename
  }
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath
  })
  Post.updateOne({ _id: req.params.id }, post)
    .then(() => {
      res.status(200).json({ message: 'Post updated.', imagePath })
    })
    .catch(error => {
      console.error('Error updating post in database: ' + error)
    })
})

router.delete('/:id', (req, res) => {
  Post.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({ message: 'Post deleted. ' })
    })
    .catch(error => {
      console.error('Error deleting post in database: ' + error)
    })
})

module.exports = router
