const mongoose = require('mongoose')

const post = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true }
})

module.exports = mongoose.model('Post', post)
