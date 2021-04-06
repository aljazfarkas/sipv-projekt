var express = require('express')
var router = express.Router()
const { ensureAuthenticated } = require('../config/auth.js')
const Food = require('../models/food')

//login page
router.get('/', (req, res) => {
  res.render('welcome')
})

//register page
router.get('/register', (req, res) => {
  res.render('register')
})

//dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard', {
    user: req.user
  })
})

//adding food to database
router.get('/add-food', ensureAuthenticated, (req, res) => {
  res.render('add-food', {
    user: req.user
  })
})

router.post('/add-food', (req, res) => {
  const {
    name,
    calories,
    saturated,
    polyunsaturated,
    monounsaturated,
    trans,
    cholesterol,
    sodium,
    potassium,
    total_carbs,
    dietary_fiber,
    sugars,
    protein,
    vitamin_a,
    vitamin_c,
    calcium,
    iron
  } = req.body
  const newFood = new Food({
    name: name,
    calories: calories,
    total_fat: {
      saturated: saturated,
      polyunsaturated: polyunsaturated,
      monounsaturated: monounsaturated,
      trans: trans
    },
    cholesterol: cholesterol,
    sodium: sodium,
    potassium: potassium,
    total_carbs: total_carbs,
    dietary_fiber: dietary_fiber,
    sugars: sugars,
    protein: protein,
    vitamin_a: vitamin_a,
    vitamin_c: vitamin_c,
    calcium: calcium,
    iron: iron
  })
  newFood
    .save()
    .then(value => {
      console.log(value)
      req.flash('success_msg', 'You now added new food!')
      res.redirect('/dashboard')
    })
    .catch(value => console.log(value))
})

module.exports = router
