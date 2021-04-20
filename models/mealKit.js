const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
const schema = new Schema({
    title: {type: String, required: true},
    included: {type: String, required: true},
    description: {type: String, required: true},
    category: {type: String, required: true},
    price: {type: Schema.Types.Decimal128, required: true},
    cookingTime: {type: String, required: true},
    servings: {type: Number, required: true},
    calories: {type: Number, required: true},
    imageUrl: {type: String, required: true},
    topMeal: {type: Boolean, default: false}
});

module.exports = model('MealKit', schema);