const express = require('express')
const router = express.Router();
router.auth = function (req, res, next) {
	req.session.acc ? next() : res.redirect("/");
}

router.accCustomer = function (req, res, next) {
	req.session.acc.role == "customer" ? next() : res.redirect("/");
}

router.accClerk = function (req, res, next) {
	req.session.acc.role == "clerk" ? next() : res.redirect("/");
}

router.customer = function (req, res) {
	res.render("account/customer");
}

router.clerk = function (req, res) {
	res.render("account/clerk");
}
module.exports = router;