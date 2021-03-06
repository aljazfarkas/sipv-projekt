const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')
const User = require('../models/user')
const { ensureAuthenticated } = require('../config/auth')

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

//adding goal weight to database
router.get('/add-goal-weight', ensureAuthenticated, (req, res) => {
  res.render('add-weight', {action: '/users/add-goal-weight'})
})

router.post('/add-goal-weight', ensureAuthenticated, (req, res) => {
  const {
      weight
  } = req.body
  console.log(req.user)
  const newGoalWeight =  User.findOne({ _id: req.user._id }).exec((err, user) => {
    console.log(err)
    console.log(user)
    if (user) {
        user.goalWeight = weight;
    user.save()
      .then(value => {
          console.log(value)
          req.flash('success_msg', 'You have now added new goal weight entry!')
          res.redirect('/dashboard')
      })
      .catch(value => console.log(value))
    }
  })
})

//adding goal calories to database
router.get('/add-goal-calories', ensureAuthenticated, (req, res) => {
  res.render('add-goal-calories', {action: '/users/add-goal-calories'})
})


router.post('/add-goal-calories', ensureAuthenticated, (req, res) => {
  const {
      calories
  } = req.body
  console.log(req.user)
  const goalCalories =  User.findOne({ _id: req.user._id }).exec((err, user) => {
    if (user) {
        user.goalCalories = calories;
    user.save()
      .then(value => {
          console.log(value)
          req.flash('success_msg', 'You have now added new goal calories entry!')
          res.redirect('/dashboard')
      })
      .catch(value => console.log(value))
    }
  })
})

module.exports = router
