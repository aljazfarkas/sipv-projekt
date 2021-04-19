var express = require('express')
var router = express.Router()
const { ensureAuthenticated } = require('../config/auth.js')
const Food = require('../models/food')

//food list
router.get('/list', (req, res) => {
  Food.find({}, function (err, foods) {
    res.render('food-list', {
      foods: foods
    })
  })
})

//particular food
router.get('/:name-:weight', (req, res) => {
  const { name, weight } = req.params
  Food.findOne({ name: name, weight: weight }, function (err, food) {
    res.render('food-info', {
      food: food
    })
  })
})

//adding food to database
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('add-food')
})

router.post('/add', (req, res) => {
  const {
    name,
    weight,
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
  Food.findOne({ name: name, weight: weight }).exec((err, food) => {
    console.log(food)
    if (food) {
      req.flash('success_msg', 'Food not added (already added by someone else)')
      res.redirect('/dashboard')
    } else {
      const newFood = new Food({
        name: name,
        weight: weight,
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
          req.flash('success_msg', 'You have now added new food!')
          res.redirect('/dashboard')
        })
        .catch(value => console.log(value))
    }
  })
})

module.exports = router
