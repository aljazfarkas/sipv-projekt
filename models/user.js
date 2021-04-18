const mongoose = require('mongoose')
const FoodDiaryEntry = require('./food_diary_entry')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  food_diary: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: FoodDiaryEntry
    }
  ]
})
const User = mongoose.model('User', UserSchema)

module.exports = User
