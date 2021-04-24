const mongoose = require('mongoose')
const Food = require('./food')
const FoodDiaryEntrySchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  type: String,
  info: [
    {
      food_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Food
      },
      quantity: Number
    }
  ]
})
const FoodDiaryEntry = mongoose.model('FoodDiaryEntry', FoodDiaryEntrySchema)

module.exports = FoodDiaryEntry
