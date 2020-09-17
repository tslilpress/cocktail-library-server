// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const Cocktail = require('../models/cocktail')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// CREATE
router.post('/ingredients', requireToken, (req, res, next) => {
  const ingredientData = req.body.ingredient
  const cocktailId = ingredientData.cocktailId

  Cocktail.findById(cocktailId)
    .then(handle404)
  // create a new ingredient by pushing to cocktail sub doc arry
  // and save the cocktail document
    .then(cocktail => {
      cocktail.ingredients.push(ingredientData)
      return cocktail.save()
    })
    .then(cocktail => res.status(201).json({ cocktail }))
    .catch(next)
})

// UPDATE
router.patch('/ingredients/:id', requireToken, removeBlanks, (req, res, next) => {
  // getting the ingredient id
  const ingredientId = req.params.id
  // getting the ingredient data from the req.body
  const ingredientData = req.body.ingredient

  Cocktail.findOne({ 'ingredients._id': ingredientId })
    .then(handle404)
    .then(cocktail => {
      // store ingredient in a variable
      const ingredient = cocktail.ingredients.id(ingredientId)
      // set the properties of ingredient to be the properties of our ingredient data
      ingredient.set(ingredientData)
      // save to cocktail
      return cocktail.save()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY
router.delete('/ingredients/:id', requireToken, (req, res, next) => {
  // extract the ingredient id
  const ingredientId = req.params.id
  // find the cocktail that contains the ingredient
  Cocktail.findOne({ 'ingredients._id': ingredientId })
    .then(handle404)
    .then(cocktail => {
      cocktail.ingredients.id(ingredientId).remove()
      return cocktail.save()
    })
    // responde with no content
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
