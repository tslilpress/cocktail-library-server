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
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
router.get('/cocktails', requireToken, (req, res, next) => {
  const userId = req.user._id
  Cocktail.find({owner: userId})
    .populate('owner')
    .then(cocktails => {
      // cocktails will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return cocktails.map(cocktail => cocktail.toObject())
    })
  // respond with status 200 and JSON
    .then(cocktails => res.status(200).json({ cocktails }))
  // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
router.get('/cocktails/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route

  Cocktail.findById(req.params.id)
    .populate('owner')
    .then(handle404)
    .then(cocktail => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, cocktail)

      return cocktail
    })
    // if `findById` is succesful, respond with 200 and "cocktail" JSON
    .then(cocktail => res.status(200).json({ cocktail: cocktail.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
router.post('/cocktails', requireToken, (req, res, next) => {
  // set owner of new cocktail to be current user
  req.body.cocktail.owner = req.user.id

  Cocktail.create(req.body.cocktail)
  // console.log(req.body.cocktail)
    // respond to succesful `create` with status 201 and JSON of new "cocktail"
    .then(cocktail => {
      res.status(201).json({ cocktail: cocktail.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
router.patch('/cocktails/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.cocktail.owner

  Cocktail.findById(req.params.id)
    .then(handle404)
    .then(cocktail => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, cocktail)

      // pass the result of Mongoose's `.update` to the next `.then`
      return cocktail.updateOne(req.body.cocktail)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
router.delete('/cocktails/:id', requireToken, (req, res, next) => {
  Cocktail.findById(req.params.id)
    .then(handle404)
    .then(cocktail => {
      // throw an error if current user doesn't own `cocktail`
      requireOwnership(req, cocktail)
      // delete the cocktail ONLY IF the above didn't throw
      cocktail.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
