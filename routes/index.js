var express = require('express')
var router = express.Router()
const { ensureAuthenticated } = require('../config/auth.js')
const Weight = require('../models/weight')
const User = require('../models/user')
const Food = require('../models/food')
const FoodDiaryEntry = require('../models/food_diary_entry')
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
router.get('/dashboard', ensureAuthenticated, async function(req, res) {
  //dobim dnevne kalorije
  var daily_calories = 0
  var query = { email: req.user.email }
  let user = await User.findOne(query).exec()
  for (let i = 0; i < user.food_diary.length; i++) {
    entry_id = user.food_diary[i]
    let diary_entry = await FoodDiaryEntry.findOne({ _id: entry_id }).exec()
    //če ima entry današnji datum
    if(moment(diary_entry.date).format('DD/MM/YYYY') == moment().format('DD/MM/YYYY')){
      for (let j = 0; j < diary_entry.info.length; j++) {
        let food_id = diary_entry.info[j].food_id
        let food = await Food.findOne({ _id: food_id }).exec()
        daily_calories += food['calories']
      }
    }
  }

  Weight.find({ user: req.user.id })
    .then((weightList) => {
      let weightDifference  = 0, currentWeight = 0, previousWeight = 0;
      if (weightList.length >= 2) {
        weightDifference = weightList[weightList.length - 1].weight - weightList[weightList.length - 2].weight;
        currentWeight = weightList[weightList.length - 1];
        previousWeight = weightList[weightList.length - 2];
      }

      let newWeightList = [];
      let goalWeightList = [];
      let minWeight = Number.MAX_SAFE_INTEGER;
      let maxWeight = 0.0;
      for (let item of weightList) {
        if (minWeight > item.weight) {
          minWeight = item.weight;
        }

        if (maxWeight < item.weight) {
          maxWeight = item.weight;
        }

        let formattedDate = moment(item.date).format('DD/MM/YYYY');

        // Če je na isti datum več vnosov, izračunamo povprečje
        let existingWeight = newWeightList.find(i => i.date === formattedDate);
        if (existingWeight) {
          existingWeight.list.push(item.weight);
          let sum = 0.0;
          for (let i of existingWeight.list) {
            sum += i;
          }

          existingWeight.weight = sum / existingWeight.list.length;
        } else {
          newWeightList.push({
            weight: item.weight,
            date: formattedDate,
            list: [item.weight],
            goalWeight: req.user.goalWeight
          })
          goalWeightList.push({
            date: formattedDate,
            weight: req.user.goalWeight
          })
        }
      }

      let beginAt = (Math.min(minWeight - 5, req.user.goalWeight - 5)).toFixed(2);
      let endAt = (Math.max(maxWeight + 5, req.user.goalWeight + 5)).toFixed(2);
      res.render('dashboard', { weightList: newWeightList, weightDifference, currentWeight, previousWeight, goalWeightList, beginAt, endAt, daily_calories })
    })
})

module.exports = router
