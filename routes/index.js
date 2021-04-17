var express = require('express')
var router = express.Router()
const { ensureAuthenticated } = require('../config/auth.js')
const Food = require('../models/food')

//login page
router.get('/', (req, res) => {
  if (req.user) {
    res.redirect('dashboard')
  } else {
    res.render('welcome')
  }
})

//register page
router.get('/register', (req, res) => {
  res.render('register')
})

//dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard')
})

module.exports = router
