const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

exports.SignUp = (req, res) => {
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
          message: 'Invalid authentication credentials!'
        })
      })
  })
}

exports.Login = (req, res) => {
  let fetchedUser
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Invalid authentication credentials!'
        })
      }
      fetchedUser = user
      return bcrypt.compare(req.body.password, user.password)
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'Failed authentication'
        })
      }
      const token = jwt.sign({ email: fetchedUser.email, userID: fetchedUser._id }, process.env.JWT_KEY, {
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
}