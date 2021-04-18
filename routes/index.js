var express = require('express')
var router = express.Router()
const { ensureAuthenticated } = require('../config/auth.js')
const Weight = require('../models/weight')

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
  Weight.find({user: req.user.id})
  .then((weightList) => {
    weightList = weightList.map((weight) => {
      let date = new Date(weight.date);
      weight.formattedDate = date.getDate();
      return weight;
    })
    res.render('dashboard', {weightList})
  })
})

module.exports = router
