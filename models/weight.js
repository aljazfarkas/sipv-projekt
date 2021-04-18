const mongoose = require('mongoose')
const WeightSchema = new mongoose.Schema({
    user: {
        type: String,
        required: false
    },
    weight: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    }
})
const Weight = mongoose.model('Weight', WeightSchema)

module.exports = Weight
