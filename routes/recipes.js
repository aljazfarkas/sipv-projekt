var express = require('express')
var router = express.Router()
const { ensureAuthenticated } = require('../config/auth.js')

router.get('/', ensureAuthenticated, (req, res) => {
    res.render('diets');
})

router.get('/:dietCategory', ensureAuthenticated, (req, res) => {
    const { dietCategory } = req.params;
    res.render('recipes', { dietCategory });
})

router.post('/add', ensureAuthenticated, (req, res) => {
    let { dietCategory, recipeName, recipeDescription, recipeTag } = req.body;
    if (recipeTag && !Array.isArray(recipeTag)) {
        recipeTag = [recipeTag];
    }
    console.log(dietCategory, recipeName, recipeDescription, recipeTag)
    res.redirect(`/recipes/${dietCategory}`);
})

module.exports = router
