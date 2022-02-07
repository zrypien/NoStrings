const express = require('express');
const {isAuthor, isNotAuthor, isLoggedIn} = require('../middlewares/auth');
const {validateId, validateConnection, validateResult, validateRSVP} = require('../middlewares/validator');
const controller = require('../controllers/connectionController'); //used for 7 RESTful routes

const router = express.Router();

//GET /index: send all connections to user

router.get('/', controller.index);

//GET /connections/new: send html form for creating new connection

router.get('/new', isLoggedIn, controller.new);

//POST /connections: create a new connection

router.post('/', isLoggedIn, validateConnection, validateResult, controller.create);

//GET /connections/:id: send details of connection identified by id
router.get('/:id', validateId, controller.show);

//GET /connections/:id/edit: send html form for editing an existing connection
router.get('/:id/edit', validateId, isLoggedIn, isAuthor, controller.edit);

//PUT /connections/:id: update the connection identified by id
router.put('/:id', validateId, isLoggedIn, validateConnection, isAuthor, controller.update);

//DELETE /connections/:id, delete the connection identified by id
router.delete('/:id', validateId, isLoggedIn, isAuthor, controller.delete);

router.delete('/:id/rsvp', validateId, isLoggedIn, isNotAuthor, controller.deleteRSVP) //delete rsvp

router.post('/:id/rsvp', validateId, isLoggedIn, isNotAuthor, validateRSVP, validateResult, controller.editRSVP); //post rsvp

module.exports = router;