const Post = require('../models/post')

exports.AddPost = (req, res) => {
  const url = req.protocol + '://' + req.get('host')
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    author: req.userData.userID
  })
  post
    .save()
    .then(savedPost => {
      res.status(201).json({
        message: 'OK',
        id: savedPost._id,
        title: savedPost.title,
        content: savedPost.content,
        imagePath: savedPost
      })
    })
    .catch(() => {
      res.status(500).json({
        message: 'Creating a post failed!'
      })
    })
}

exports.GetPost = (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post)
      } else {
        res.status(404).json({ message: 'Post not found' })
      }
    })
    .catch(() => {
      res.status(500).json({
        message: 'Fetching post failed!'
      })
    })
}

exports.GetPosts = (req, res) => {
  const pageSize = +req.query.size
  const currentPage = +req.query.page
  const postQuery = Post.find()
  let fetchedPosts
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize)
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents
      return Post.countDocuments()
    })
    .then(count => {
      let posts = []
      fetchedPosts.map(post =>
        posts.push({
          id: post._id,
          title: post.title,
          content: post.content,
          imagePath: post.imagePath,
          author: post.author
        })
      )
      res.status(200).json({
        message: 'OK',
        maxPosts: count,
        posts
      })
    })
    .catch(() => {
      res.status(500).json({
        message: 'Fetching posts failed!'
      })
    })
}

exports.UpdatePost = (req, res) => {
  let imagePath = req.body.imagePath
  if (req.file) {
    const url = req.protocol + '://' + req.get('host')
    imagePath = url + '/images/' + req.file.filename
  }
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath,
    author: req.userData.userID
  })
  Post.updateOne({ _id: req.params.id, author: req.userData.userID }, post)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: 'Post updated', imagePath })
      } else {
        res.status(401).json({ message: 'Not Authorized' })
      }
    })
    .catch(error => {
      console.error('Error updating post in database: ' + error)
    })
}

exports.DeletePost = (req, res) => {
  Post.deleteOne({ _id: req.params.id, author: req.userData.userID })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: 'Post deleted' })
      } else {
        res.status(401).json({ message: 'Not Authorized' })
      }
    })
    .catch(error => {
      console.error('Error deleting post in database: ' + error)
    })
}
