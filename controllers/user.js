const express = require('express');
const bcrypt = require("bcryptjs");
const path = require("path");
const UserModel = require('../models/user.js');
const router = express.Router();
const sgMail = require("@sendgrid/mail");
const bodyParser = require('body-parser');
const formVal = bodyParser.urlencoded({ extended: false });

//register
// setup another route to listen on /register
router.get("/register", (req, res) => {
    res.render("user/register", {
        title: "Sign Up"
    });
});
//login
// setup another route to listen on /login
router.get("/login", (req, res) => {
    res.render("user/login", {
        title: "Log In"
    });
});
//login validation form
router.post("/login", formVal, function(req, res, login) {
    console.log(req.body);

    let validationMessages = new Object();
   
    const { email, password, role } = req.body;

if (!email) {
    validationMessages['email']= "Please enter your email address.";
}
    
if (!password) {
    validationMessages['password'] = "Please enter your password.";
   
}
return Object.keys(validationMessages).length
				? res.render("user/login", {
					validationMessages,
                    title: "Log In",
					values: req.body
				})
				: login();

}, (req, res) => {
    let errors = [];
    const {email, password, role} = req.body;
    // Search MongoDB for a document with the matching email address.
    UserModel.findOne({
        email: req.body.email
    })
    .then((user) => {
        if (!user) 
           res.render("user/login", {
               errors: "Sorry, your email does not match our database.",
           });
           
    
    else if (!bcrypt.compare(req.body.password, user.password))
			res.render("user/login", {
				errors: "Sorry, your password does not match our database."
			});
            /*if(req.session && req.session.user && req.session.acc.clerk) {
                res.redirect("account/clerk")
            }
            else if 
                (req.session && req.session.user && req.session.acc.customer){
                    res.redirect("account/customer")
                }
                else {
                    res.send("You do not have permission to access.")
                }*/
            
		else {
			req.session.acc = {user, role};
			res.redirect(role == "customer" ? "/account/customer" : "/account/clerk");
		}
	})
       
            .catch((err) => {
                // bcrypt failed for some reason.
                console.log(`Error comparing passwords: ${err},`);
                errors.push("Oops, something went wrong.");
        
                res.render("user/login", {
                    validationMessages: errors,
                    errors
                });
            })
        });
        

   // Set up logout page
router.get("/logout", (req, res) => {
    // Clear the session from memory.
    req.session.destroy();
    
    res.redirect("/user/login");
});


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
				? res.render("user/register", {
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
                res.redirect("/user/welcome");

                //save
                const user = new UserModel({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    password: req.body.password,
                    role: req.body.role
                });

                
                user.save()
                .then((userSaved) => {
                    console.log(`User ${userSaved.firstname} has been saved to the database.`);
                })
                .catch((err) => {
                    console.log(`Error adding user to the database.  ${err}`);
                    res.redirect("/");
                });
               
            
});
// welcome page after user login or registration
router.get("/welcome", (req, res) => res.render("user/welcome"));


module.exports = router;