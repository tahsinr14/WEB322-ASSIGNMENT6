/************************************************************************************
* WEB322 – Assignment 4 (Winter 2021)
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
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');

const dotenv = require('dotenv');
dotenv.config({path:"./config/keys.env"});

var app = express();

app.engine('.hbs', exphbs({ 
    extname: '.hbs',
    defaultLayout: 'main' ,
    helpers: {
        // displays form validation error, got from the internet
		Check(field, validationMessages) {
			if (validationMessages != undefined && field in validationMessages)
				return `
					<span class="form-error">
						${validationMessages[field]}
					</span>
				`;
		},
        // equality check found from the internet: https://stackoverflow.com/questions/34252817/handlebarsjs-check-if-a-string-is-equal-to-a-value
		eq(arg1, arg2, option) {
			return arg1 == arg2 ? option.fn(this) : option.inverse(this);
		}
    }
}));
app.set('view engine', '.hbs');

// Set up express-session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

//set up connection to MongoDB
mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true
})
.then(() => {
    console.log("Connected to the MongoDB database.");
})
.catch((err) => {
    console.log(`There was a problem connecting to the MongoDB...${err}`)
});



//setup a folder that static resources can load from.
//include images, css files, etc.
app.use(express.static(__dirname + "/public"));

// Load Controllers
const generalController = require("./controllers/general");
app.use("/", generalController);

const userController = require("./controllers/user");
app.use("/user", userController);

const accountController = require("./controllers/accountController");
//app.use("/account", accountController);

// customer dashboard
app.get('/account/customer', accountController.auth, accountController.accCustomer, accountController.customer);

// data entry clerk dashboard
app.get('/account/clerk', accountController.auth, accountController.accClerk, accountController.clerk);

// Set up body parser
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());


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

var PORT = process.env.PORT;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log(`Web Server is up and running, port ${PORT}`);
}

// setup http server to listen on HTTP_PORT
app.listen(PORT, onHttpStart);
