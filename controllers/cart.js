const { Router } = require("express");
const meals = require("../models/mealKit");
const sgMail = require('@sendgrid/mail');
const authenticate = (req, res, next) => req.session.acc ? next() : res.redirect("/");
const authorize = (req, res, next) => req.session.acc.role == 'customer' ? next() : res.redirect("/");

const router = Router();

router.use(authenticate, authorize);

router.get('/', function (req, res) {

    const cartIsEmpty = req.session.cart.length == 0;
    const totalAmount = req.session.cart.reduce((accumulator, {quantity, price}) => {
        return accumulator + (price * quantity);
    }, 0).toFixed(2);
    
    res.render('dashboard/cart', {cartIsEmpty, totalAmount});
});

router.get('/checkout', function (req, res) {

    const totalAmount = '$' + req.session.cart.reduce((accumulator, {quantity, price}) => {
        return accumulator + (price * quantity);
    }, 0).toFixed(2);
    const mealsPurchased = req.session.cart.map((meal, index) => {
        return `
            <tr>
                <td>${index + 1}</td>
                <td style="text-align: left;">${meal.title}</td>
                <td style="text-align: left;">${'$' + meal.price}</td>
                <td style="text-align: left;">${'x' + meal.quantity}</td>
                <td style="text-align: left;">${'$' + (meal.quantity * meal.price).toFixed(2)}</td>
            </tr>`;
    })
    .join('<tr><td colspan="5"><hr></td></tr>');
    const message = {
		to: req.session.acc.user.email,
		from: 'trahman31@myseneca.ca',
		subject: 'Order Confirmation',
		html: `
			<p>
                Hello ${req.session.acc.user.firstname}, you have successfully completed your order.
            </p>
            <h3>Order Details</h3>
			<table cellspacing="30" style="border: 1px solid black";>
                <thead>
                    <tr style="border-bottom: 1px solid black;">
                        <th style="text-align: left;">No.</th>
                        <th style="text-align: left;">Meal Kit</th>
                        <th style="text-align: left;">Price</th>
                        <th style="text-align: left;">Quantity</th>
                        <th style="text-align: left;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td colspan="5"><hr></td></tr>
                    ${mealsPurchased}
                </tbody>
            </table>
            <h3>Total Amount: ${totalAmount}</h3>
			Enjoy! <br>
            <i>Tahsin Rahman</i>
		`
	};

    sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
	sgMail.send(message);

    req.session.cart = [];

    res.redirect('back');
});

router.post('/delete', function (req, res) {

    req.session.cart = req.session.cart.filter(item => item.id !== req.body.meal);

    res.redirect('back');
});

router.post('/update', function (req, res) {

    const meal = req.session.cart.map(meal => meal.id).indexOf(req.body.meal);
    
    req.session.cart[meal].quantity = req.body.quantity;

    res.redirect('back');
});

router.post('/', async function (req, res) {

    const meal = await meals.findById(req.body.meal);

    req.session.cart.push({
        id: meal._id,
        title: meal.title,
        imageUrl: meal.imageUrl,
        cookingTime: meal.cookingTime,
        price: meal.price.toString(),
        quantity: parseInt(req.body.quantity)
    });

    res.redirect('back');
});

module.exports = router;