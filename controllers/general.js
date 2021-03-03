
const sgMail = require("@sendgrid/mail");
const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser');
const formVal = bodyParser.urlencoded({ extended: false });
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
//register
// setup another route to listen on /register
router.get("/register", (req, res) => {
    res.render("general/register", {
        title: "Sign Up"
    });
});


//login
// setup another route to listen on /login
router.get("/login", (req, res) => {
    res.render("general/login", {
        title: "Log In"
    });
});
//login validation form
router.post("/login", formVal, function(req, res, login) {
    console.log(req.body);

    let validationMessages = new Object();
   
    const { email, password } = req.body;

if (!email) {
    validationMessages['email']= "Please enter your email address.";
}
    
if (!password) {
    validationMessages['password'] = "Please enter your password.";
   
}
return Object.keys(validationMessages).length
				? res.render("general/login", {
					validationMessages,
                    title: "Log In",
					values: req.body
				})
				: login();

}, (req, res) => res.redirect("/"));
   

//register validation form
router.post("/register", formVal, function (req, res, reg) {
    console.log(req.body);

    let validationMessages = new Object(); 
    let checkValidation = true;
    
    
    const { firstname, lastname, email, password  } = req.body;

    if (typeof firstname !== "string" || firstname.length === 0) {
        validationMessages['firstname'] = "You must specify a first name.";
        checkValidation = false;
    }
    else if (firstname.length < 2) {
        validationMessages['firstname'] = "The first name must be at least 2 characters.";
        checkValidation = false;
    }
    if (!lastname)
    validationMessages['lastname'] = "Please enter your last name.";

    if (!email) {
        validationMessages['email'] = "Please enter a valid email address.";
        checkValidation = false;
    }
     if (email) {
        emailregEx = /^\S+@\S+\.\S+$/; //normal email regex found on google
        if (!email.match(emailregEx))
        validationMessages['email'] = "Please enter a valid email address.";
        checkValidation = false;
    }
    

    if (password === 0) {
        validationMessages['password'] = "Please enter your password.";
        checkValidation = false;
    }
    
    //made up on my own
    if(password.length < 6) {
        validationMessages['password'] = "Your password must be at least 6 characters";
    }
    else if(password.length > 12) {
        validationMessages['password'] = "Your password should not be more than 12 characters";
    }
    else if (password.search(/[a-z]/i) < 0) {
        validationMessages['password'] = "Your password must contain at least one lower case letter.";
    }
    else if (password.search(/[A-Z]/) < 0) {
        validationMessages['password'] = "Your password must contain at least one upper case letter.";
    }
    else if (password.search(/[0-9]/) < 0) {
        validationMessages['password'] = "Your password must contain at least one digit.";
    }
    else if(password.search(/[!#$%&?@"]/) < 0) {
        validationMessages['password'] = "Your password must contain at least one symbol.";
    }
    if(!password){
    validationMessages['password'] = "Please enter a valid password.";
    checkValidation = false;
   }
   return Object.keys(validationMessages).length
				? res.render("general/register", {
                    title: "Sign Up",
					validationMessages,
					values: req.body
				})
				: reg();

}, (req, res) => {
   sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
//message sent to email
   const msg = {
            to: req.body.email,
            from: "trahman31@myseneca.ca",
            subject: "Thank you for Signing Up.",
            html:
                `
                <h3>Hello! ${req.body.firstname}</h3><br>
                Welcome to <b>Euphoria Meals</b>!<br>
                Thank you for joining us!<br>
                We will do our best to provide you the best service.<br>
                Enjoy! <br>
                <i>Tahsin Rahman</i>
                `
        }
        sgMail.send(msg);
       //redirect to welcome page
                res.redirect("/welcome");
});
// welcome page after user login or registration
router.get("/welcome", (req, res) => res.render("general/welcome"));

module.exports = router;

