const mongoose = require('mongoose')
const FoodDiaryEntrySchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },

})
const FoodDiaryEntry = mongoose.model('FoodDiaryEntry', FoodDiaryEntrySchema)

module.exports = FoodDiaryEntry
