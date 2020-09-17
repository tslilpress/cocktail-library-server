const mongoose = require('mongoose')

const ingredientSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  unit: {
    type: String,
    required: true
  }
})

module.exports = ingredientSchema
