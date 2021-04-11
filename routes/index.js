var express = require('express')
var router = express.Router()
const { ensureAuthenticated } = require('../config/auth.js')
const Food = require('../models/food')

//login page
router.get('/', (req, res) => {
  res.render('welcome', {
    user: req.user
  })
})

//register page
router.get('/register', (req, res) => {
  res.render('register', {
    user: req.user
  })
})

//dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard', {
    user: req.user
  })
})

module.exports = router
