const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const router = express.Router()

router.post('/signup', (req, res) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    })
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: 'User created',
          result
        })
      })
      .catch(error => {
        res.status(500).json({
          error
        })
      })
  })
})

router.post('/login', (req, res) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Failed authentication'
        })
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password)
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'Failed authentication'
        })
      }
      const token = jwt.sign({ email: fetchedUser.email, userID: fetchedUser._id }, 'some super c-sec long secret that should be super secure', {
        expiresIn: '1h'
      })
      res.status(200).json({
        message: 'Authentication successful',
        token,
        expiresIn: 3600,
        userID: fetchedUser._id
      })
    })
    .catch(error => {
      res.status(401).json({
        message: 'Failed authentication',
        error
      })
    })
})

module.exports = router
