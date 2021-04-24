var express = require('express')
var router = express.Router()
const { ensureAuthenticated } = require('../config/auth.js')
const Recipe = require('../models/recipe')
let moment = require('moment')

router.get('/', ensureAuthenticated, (req, res) => {
    res.render('diets');
})

router.get('/:dietCategory', ensureAuthenticated, async (req, res) => {
    const { dietCategory } = req.params;

    const recipesList = await Recipe.find({ category: dietCategory });
   
    res.render('recipes', { dietCategory, recipesList, moment });
})

router.post('/add', ensureAuthenticated, async (req, res) => {
    let { dietCategory, recipeName, recipeDescription, recipeTag } = req.body;
    if (recipeTag && !Array.isArray(recipeTag)) {
        recipeTag = [recipeTag];
    }

    const newRecipe = new Recipe({
        user: req.user.id,
        name: recipeName,
        description: recipeDescription,
        tag: recipeTag,
        category: dietCategory
    })

    const recipe = await newRecipe.save();
    console.log(recipe)
    res.redirect(`/recipes/${dietCategory}`);
})

router.delete('/:id', ensureAuthenticated, async (req, res) => {
    const { id } = req.params;
    await Recipe.deleteOne({ _id: id });
    res.send({});
})

module.exports = router
