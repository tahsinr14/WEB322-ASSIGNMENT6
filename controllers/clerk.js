const { Router } = require("express");
const router = Router();
const authenticate = (req, res, next) => req.session.acc ? next() : res.redirect("/");
const authorize = (req, res, next) => req.session.acc.role == 'clerk' ? next() : res.redirect("/");
const mealKit = require('../models/mealKit');
const path = require('path');

router.use(authenticate, authorize);

router.get('/meal-kits', async (req, res) => {
    let meals = (await mealKit.find()).map(meal => meal.toJSON());
    res.render('dashboard/meals/list', {meals});
});

router.get('/new-meal-kit', (req, res) => res.render('dashboard/meals/add'));

router.post('/post-meal-kit', async (req, res) => {
    let image = req.files.image;
    let imageUrl = `/images/${image.name}`;
    await image.mv(path.resolve(`./public${imageUrl}`));
    await mealKit.create({imageUrl, ...req.body});
    res.redirect('/clerk/meal-kits');
});

router.get('/edit-meal-kit/:id', async (req, res) => {
    let meal = (await mealKit.findById(req.params.id)).toJSON();
    res.render('dashboard/meals/edit', {meal});
});

router.post('/update-meal-kit/:id', async (req, res) => {
    let imageUrl, files = req.files;
    if (files) {
        imageUrl = `/images/${files.image.name}`;
        await files.image.mv(path.resolve(`./public${imageUrl}`));
    }
    else {
        imageUrl = (await mealKit.findById(req.params.id)).imageUrl;
    }
    await mealKit.updateOne({_id: req.params.id}, {imageUrl, ...req.body});
    res.redirect('/clerk/meal-kits');
});

module.exports = router;