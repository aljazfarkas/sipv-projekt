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
  Weight.find({ user: req.user.id })
    .then((weightList) => {
      let weightDifference = weightList[weightList.length - 1].weight - weightList[weightList.length - 2].weight;
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

      let currentWeight = weightList[weightList.length - 1];
      let previousWeight = weightList[weightList.length - 2];

      let beginAt = (Math.min(minWeight - 5, req.user.goalWeight - 5)).toFixed(2);
      console.log(beginAt)
      let endAt = (Math.max(maxWeight + 5, req.user.goalWeight + 5)).toFixed(2);
      res.render('dashboard', { weightList: newWeightList, weightDifference, currentWeight, previousWeight, goalWeightList, beginAt, endAt })
    })
})

module.exports = router
