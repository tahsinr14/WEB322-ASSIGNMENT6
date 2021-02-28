
const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser');
const formSubmit = bodyParser.urlencoded({ extended: false });
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
router.post("/login", formSubmit, function(req, res, next) {
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
					values: req.body
				})
				: next();

}, (req, res) => res.redirect("/welcome"));
   


router.post("/register", formSubmit, function (req, res, next) {
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
        emailregEx = /^\S+@\S+\.\S+$/;
        if (!email.match(emailregEx))
        validationMessages['email'] = "Please enter a valid email address.";
        checkValidation = false;
    }
    

    if (!password) {
        validationMessages['password'] = "Please enter your password.";
        checkValidation = false;
    }
     if (password) {
        passregEx = /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[#$@!%&?])[A-Za-z\d#$@!%&?]{6,12}$/;
        
        if(!password.match(passregEx))
        validationMessages['password'] = "Please enter a valid password.";
        //checkValidation = false;
    }
   

    return Object.keys(validationMessages).length
				? res.render("general/register", {
					validationMessages,
					values: req.body
				})
				: next();

            },(req, res)=> {

    if (checkValidation) {
        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

        const msg = {
            to: req.body.email,
            from: "trahman31@myseneca.ca",
            subject: "Thank you for Signing Up!",
            html:
                `
                <h3>Hello! ${firstname}</h3><br>
                Welcome to <b>Euphoria Meals</b>!<br>
                Thank you for joining us!<br>
                We will do our best to provide you the best service.<br>
                Enjoy! <br>
                <i>Tahsin Rahman</i>
                `
        };

        // Asyncronously sends the email message.
        sgMail.send(msg)
            .then(() => {
                res.send("Success");
            })
            .catch(err => {
                console.log(`Error ${err}`);
                res.send("Error");
            });
    }
    
    res.redirect("/welcome")
});
// welcome page after user login or registration
router.get("/welcome", (req, res) => res.render("general/welcome"));

module.exports = router;