const { Router } = require("express");
const mealKit = require("../models/mealKit");
const { mealList } = require("../models/data");
const router = Router();

router.use((req, res, next) => req.session.acc ? next() : res.redirect("/"));

router.get('/', async (req, res) => {
    let title = "Load Meal Kits Data";
    if (req.session.acc.role != 'clerk') {
        res.render('dashboard/loadData', {title, message: 'You are not authorized to add meal kits.'});
    }
    else if (await mealKit.countDocuments()) {
        res.render('dashboard/loadData', {title, message: 'Meal kits have already been added to the database.'});
    }
    else {
        mealKit.create(mealList).then(() => {
            res.render('dashboard/loadData', {title, message: 'Added meal kits to the database.'});
        })
    }
});

module.exports = router;