/************************************************************************************
* WEB322 – Assignment 2 (Winter 2021)
* I declare that this assignment is my own work in accordance with Seneca Academic
* Policy. No part of this assignment has been copied manually or electronically from
* any other source (including web sites) or distributed to other students.
*
* Name: Tahsin Rahman
* Student ID: 165063199
* Course: WEB322 NDD
*
************************************************************************************/

var path = require("path");
var express = require("express");

const exphbs = require('express-handlebars');
const  { getTopMeal, getAllMeal}  
= require("./models/data.js"); 

var app = express();

app.engine('.hbs', exphbs({ 
    extname: '.hbs',
    defaultLayout: 'main' 
}));
app.set('view engine', '.hbs');

//setup a folder that static resources can load from.
//include images, css files, etc.
app.use(express.static(__dirname + "/public"));

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req,res){
    res.render ("home", { meals: getTopMeal()});
    
});

// setup another route to listen on /OnTheMenu
app.get("/OnTheMenu", function(req,res){
   // console.log(veganMeals());
  res.render("OnTheMenu", {
    mealKit: getAllMeal()}); 
});

// setup another route to listen on /register
app.get("/register", function(req,res){
    res.render ("register");
   
});

// setup another route to listen on /login
app.get("/login", function(req,res){
    res.render ("login");
 
});

//set up a route to a header page (http://localhost:8080/headers)
app.get("/headers", (req, res) => {
    const headers = req.headers;
    res.send(headers);
});

//bad port
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

//This use() will add an error handler function to
//catch all errors.
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send("Something is broke!");
});

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);
