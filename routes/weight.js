var express = require('express')
var router = express.Router()
const { ensureAuthenticated } = require('../config/auth.js')
const Weight = require('../models/weight')
const passport = require('passport')

//adding weight to database
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('add-weight', {action: '/weight/add'})
})

router.post('/add', ensureAuthenticated, (req, res) => {
    const {
        weight
    } = req.body
    const newWeight = new Weight({
        user: req.user.id,
        weight: weight
    })
    newWeight
        .save()
        .then(value => {
            console.log(value)
            req.flash('success_msg', 'You have now added new weight entry!')
            res.redirect('/dashboard')
        })
        .catch(value => console.log(value))
})

module.exports = router
