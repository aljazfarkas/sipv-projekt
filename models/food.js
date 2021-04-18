const mongoose = require('mongoose')
const FoodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  //v g  
  weight: {
      type: Number
  },
  //v kcal
  calories: {
    type: Number
  },
  //v g
  total_fat: {
    saturated: { type: Number },
    polyunsaturated: { type: Number },
    monounsaturated: { type: Number },
    trans: { type: Number }
  },
  //v mg
  cholesterol: {
    type: Number
  },
  //v mg
  sodium: {
    type: Number
  },
  //v mg
  potassium: {
    type: Number
  },
  //v g
  total_carbs: {
    type: Number
  },
  //v g
  dietary_fiber: {
    type: Number
  },
  //v g
  sugars: {
    type: Number
  },
  //v g
  protein: {
    type: Number
  },
  //procent dnevno
  vitamin_a: {
    type: Number
  },
  //procent dnevno
  vitamin_c: {
    type: Number
  },
  //procent dnevno
  calcium: {
    type: Number
  },
  //procent dnevno
  iron: {
    type: Number
  }
})
const Food = mongoose.model('Food', FoodSchema)

module.exports = Food
