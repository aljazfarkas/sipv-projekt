const mongoose = require('mongoose')
const RecipeSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tag: {
        type: [String],
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    }
})
const Recipe = mongoose.model('Recipe', RecipeSchema)

module.exports = Recipe
