var express = require('express')
var router = express.Router()
const { ensureAuthenticated } = require('../config/auth.js')
const Weight = require('../models/weight')
let moment = require('moment');

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
    let weightDifference = weightList[weightList.length - 1].weight - weightList[weightList.length - 2].weight;
    weightList = weightList.map((weight) => {
      let formattedDate = moment(weight.date).format('DD/MM/YYYY');
      weight.date = formattedDate;
      return {
        weight: weight.weight,
        date: formattedDate
      };
    })
    let currentWeight = weightList[weightList.length - 1];
    console.log(currentWeight);
    let previousWeight = weightList[weightList.length - 2];
    res.render('dashboard', {weightList, weightDifference, currentWeight, previousWeight})
  })
})

module.exports = router
