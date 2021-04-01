
const express = require('express')
const router = express.Router();
const  { getTopMeal, getAllMeal}  
= require("../models/data.js"); 


//home
// setup a 'route' to listen on the default url path (http://localhost)
router.get("/", (req, res) => {
    res.render("general/home", {
        meals: getTopMeal(),
        title: "Euphoria Meals"
    });
});

//on the menu
// setup another route to listen on /OnTheMenu
router.get("/onTheMenu", (req, res) => {
    res.render("general/onTheMenu", {
        mealKit: getAllMeal(),
        title: "On The Menu"
    });
});


module.exports = router;

