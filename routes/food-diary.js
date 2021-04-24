const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Food = require('../models/food')
const FoodDiaryEntry = require('../models/food_diary_entry')
const { ensureAuthenticated } = require('../config/auth')

//food diary list
router.get('/list', ensureAuthenticated, async function (req, res) {
  //dodam shranjeni entry k userju
  var query = { email: req.user.email }
  var diaryEntries = Array()
  User.findOne(query, async function (err, user) {
    for (let i = 0; i < user.food_diary.length; i++) {
      entry_id = user.food_diary[i]
      let diary_entry = await FoodDiaryEntry.findOne({ _id: entry_id }).exec()
      let foodArray = Array()
      for (let j = 0; j < diary_entry.info.length; j++) {
        let food_id = diary_entry.info[j].food_id
        let quantity = diary_entry.info[j].quantity
        let food = await Food.findOne({ _id: food_id }).exec()

        foodArray.push({ food: food, quantity: quantity })
      }
      diaryEntries.push({
        date: diary_entry.date,
        foods: foodArray
      })
    }
    var moment = require('moment')
    res.render('food-diary-list', {
      date: user.food_diary.date,
      diary_entries: diaryEntries,
      moment: moment
    })
  })
})

//food diary entry
router.get('/add', ensureAuthenticated, (req, res) => {
  Food.find({}, function (err, foods) {
    res.render('food-diary-entry', {
      foods: foods
    })
  })
})

//ko user submita diary entry
router.post('/add', ensureAuthenticated, async function (req, res) {
  let { type, names, quantities } = req.body
  let foodArray = Array()
  if (!Array.isArray(names)) {
    names = [names]
    quantities = [quantities]
  }
  for (let i = 0; i < names.length; i++) {
    if (quantities[i] != 0) {
      let pair = names[i].split('-')
      let name = pair[0]
      let weight = pair[1]
      //najdemo hrano, ki jo hočemo
      let food = await Food.findOne({ name: name, weight: weight }).exec()
      foodArray.push({ food_id: food._id, quantity: quantities[i] })
    }
  }
  const entry = new FoodDiaryEntry({
    type: type,
    info: foodArray
  })
  entry.save().then(value => {
    //dodam shranjeni entry k userju
    var query = { email: req.user.email }
    User.findOneAndUpdate(
      query,
      { $push: { food_diary: [value._id] } },
      function (err, doc) {
        req.flash('success_msg', 'You have now added a food diary entry!')
        res.redirect('/dashboard')
      }
    )
  })
})

module.exports = router
