const express = require('express');
const controller = require('../controllers/mainController'); //used for site navigation

const router = express.Router();

router.get('/contact', controller.contact); //gets the contact page
router.get('/about', controller.about); //gets the about page
router.get('/', controller.index); //gets the home page

module.exports = router;