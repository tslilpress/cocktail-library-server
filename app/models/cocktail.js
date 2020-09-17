const mongoose = require('mongoose')

const ingredientSchema = require('./ingredient')

const cocktailSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  preparation: {
    type: String,
    required: true
  },
  serveIn: {
    type: String,
    required: true
  },
  howToServe: {
    type: String,
    required: true
  },
  ingredients: [ingredientSchema],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  note: {
    type: String,
    required: false
  }
}, {
  timestamps: true
})

const Cocktail = mongoose.model('Cocktail', cocktailSchema)

module.exports = Cocktail
