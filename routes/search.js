const express = require('express')
const router = express.Router()
const Recipe = require('../models/recipe')
const { ensureAuthenticated } = require('../config/auth')

router.get('/', ensureAuthenticated, async (req, res) => {
    let searching = req.query.search
    const recipesList = await Recipe.find({ name: { $regex: '.*' + searching + '.*'}}).exec()
    const moment = require('moment')
    res.render('search', {searching, recipesList, moment})
})

module.exports = router
