const express = require('express')
const UserController = require('../controllers/user')

const router = express.Router()

router.post('/signup', UserController.SignUp)

router.post('/login', UserController.Login)

module.exports = router
