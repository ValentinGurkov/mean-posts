const express = require('express')

const PostsController = require('../controllers/posts')
const checkAuth = require('../middleware/check-auth')
const extractFile = require('../middleware/file')

const router = express.Router()

router.post('', checkAuth, extractFile, PostsController.AddPost)

router.get('/:id', PostsController.GetPost)

router.get('', PostsController.GetPosts)

router.patch('/:id', checkAuth, extractFile, PostsController.UpdatePost)

router.delete('/:id', checkAuth, PostsController.DeletePost)

module.exports = router
