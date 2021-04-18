const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')
const User = require('../models/user')
const Food = require('../models/food')
const FoodDiaryEntry = require('../models/food_diary_entry')
const { ensureAuthenticated } = require('../config/auth')

//food diary
router.get('/food-diary', ensureAuthenticated, (req, res) => {
  Food.find({}, function (err, foods) {
    res.render('food-diary', {
      foods: foods
    })
  })
})

router.post('/food-diary', ensureAuthenticated, async function (req, res) {
  let { names, quantities } = req.body
  let foodArray = Array()
  if (!Array.isArray(names)) {
    names = [names]
    quantities = [quantities]
  }
  for (i = 0; i < names.length; i++) {
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

//login handle
router.get('/login', (req, res) => {
  res.render('login')
})
router.get('/register', (req, res) => {
  res.render('register')
})
//Register handle
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body
  let errors = []
  console.log(' Name ' + name + ' email :' + email + ' pass:' + password)
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields' })
  }
  //check if match
  if (password !== password2) {
    errors.push({ msg: 'passwords dont match' })
  }

  //check if password is more than 6 characters
  if (password.length < 6) {
    errors.push({ msg: 'password atleast 6 characters' })
  }
  if (errors.length > 0) {
    res.render('register', {
      errors: errors,
      name: name,
      email: email,
      password: password,
      password2: password2
    })
  } else {
    //validation passed
    User.findOne({ email: email }).exec((err, user) => {
      if (user) {
        errors.push({ msg: 'email already registered' })
        res.render('register', {
          errors: errors,
          name: name,
          email: email,
          password: password,
          password2: password2
        })
      } else {
        const newUser = new User({
          name: name,
          email: email,
          password: password
        })
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            //save pass to hash
            newUser.password = hash
            //save user
            newUser
              .save()
              .then(value => {
                console.log(value)
                req.flash('success_msg', 'You have now registered!')
                res.redirect('/users/login')
              })
              .catch(value => console.log(value))
          })
        )
      }
    })
  }
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next)
})

//logout
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'Now logged out')
  res.redirect('/users/login')
})
module.exports = router
