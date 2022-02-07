const {body} = require('express-validator');
const {validationResult} = require('express-validator');

//ensures route parameter is a valid ObjectId type value
exports.validateId = (req, res, next)=>{
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid connection id');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
};

exports.validateRSVP = [body('rsvp').isIn(['Yes','No','Maybe'])];

exports.validateSignUp = [body('firstName', 'first name cannot be empty').notEmpty().trim().escape(),
body('lastName', 'last name cannot be empty').notEmpty().trim().escape(),
body('email', 'Email must be a valid email').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters.').isLength({min: 8, max:64})];

exports.validateLogIn = [body('email', 'Email must be a valid email').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters.').isLength({min: 8, max:64})];

exports.validateResult = (req,res,next) =>{
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
}

exports.validateConnection = [body('topic', 'must be a valid topic').notEmpty().trim().escape(), body('title', 'must be a valid title').notEmpty().trim().escape(),
body('description', 'must be a valid description').trim().escape().isLength({min: 10})];
