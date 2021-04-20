
const express = require('express')
const router = express.Router();
const  { getTopMeal, getAllMeal, veganMeals}  
= require("../models/data.js");
const meals = require('../models/mealKit');


//home
// setup a 'route' to listen on the default url path (http://localhost)
router.get("/", async (req, res) => {
    res.render("general/home", {
        meals: await getTopMeal(),
        title: "Euphoria Meals"
    });
});

//on the menu
// setup another route to listen on /OnTheMenu
router.get("/onTheMenu", async (req, res) => {
    res.render("general/onTheMenu", {
        meals: await getAllMeal(),
        title: "On The Menu"
    });
});

// meal kit description
router.get("/:meal/meal", async (req, res) => {
    const meal = await meals.findById(req.params.meal);
	const mealInCart = req.session.cart.find(item => item.id == meal._id);
	res.render('general/meal', {mealInCart, meal: meal.toJSON()});
});

// vegan menu
router.get("/veganMenu", async (req, res) => {
    res.render("general/vegan", {
        meals: await veganMeals(),
        title: "Vegan Menu"
    });
});

module.exports = router;

