var express = require('express')
var router = express.Router()
const { ensureAuthenticated } = require('../config/auth.js')
const Food = require('../models/food')

//food list
router.get('/list', ensureAuthenticated, (req, res) => {
  Food.find({}, function (err, foods) {
    res.render('food-list', {
      foods: foods
    })
  })
})

//adding food to database
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('add-food')
})

//particular food
router.get('/:id', ensureAuthenticated, (req, res) => {
  const { id } = req.params
  Food.findOne({ _id: id }, function (err, food) {
    res.render('food-info', {
      food: food
    })
  })
})


router.post('/add', ensureAuthenticated, (req, res) => {
  const {
    name,
    quantity_type,
    quantity,
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
  Food.findOne({ name: name, weight: weight, calories: calories }).exec((err, food) => {
    if (food) {
      req.flash('success_msg', 'Food not added (already added by someone else)')
      res.redirect('/dashboard')
    } else {
      const newFood = new Food({
        name: name,
        quantity_type: quantity_type,
        quantity: quantity,
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
