const model = require('../models/connection');
const rsvpModel = require('../models/rsvp');

exports.index = (req, res, next)=>{
    model.find()
    .then(connections=>res.render('./connection/index', {connections}))
    .catch(err=>next(err));
};

exports.new = (req, res)=>{
    res.render('./connection/newConnection');
};

exports.create = (req, res, next)=>{
    let connection = new model(req.body);//create a new connection document
    connection.host = req.session.user;
    connection.save()//insert the document to the database
    .then(connection=> res.redirect('/connections'))
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
            err.status = 400;
        }
        next(err);
    });
    
};

exports.show = (req, res, next)=>{
    let id = req.params.id;
    let user = req.session.user;
    Promise.all([model.findById(id).populate('host', 'firstName lastName'), rsvpModel.count({connection:id, rsvp:"Yes"})])
    .then(results=>{
    const [connection, rsvps] = results;
        if(connection) {
            return res.render('./connection/show', {connection, user, rsvps});
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.edit = (req, res, next)=>{
    let id = req.params.id;
    model.findById(id)
    .then(connection=>{
        if(connection) {
            return res.render('./connection/edit', {connection});
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.update = (req, res, next)=>{
    let connection = req.body;
    let id = req.params.id;

    model.findByIdAndUpdate(id, connection, {useFindAndModify: false, runValidators: true})
    .then(connection=>{
        if(connection) {
            res.redirect('/connections/'+id);
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=> {
        if(err.name === 'ValidationError')
            err.status = 400;
        next(err);
    });
};

exports.delete = (req, res, next)=>{
    let user = req.session.user;
    if(user){
    let id = req.params.id;
        Promise.all([model.findByIdAndDelete(id, {useFindAndModify: false}), rsvpModel.deleteMany({connection:id})])
    .then(connection =>{
       req.flash('success', "successfully deleted connection and rsvps."); //deletes connections and the rsvps associated with the connection
       res.redirect('/connections');
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            req.flash('error', err.message);
            return res.redirect('/back');
        }
        next(err);
    });
}
};

exports.editRSVP = (req, res, next) => {
    console.log(req.body.rsvp);
    let id = req.params.id;
    console.log(id);
    rsvpModel.findOne({connection:id, user:req.session.user}).then(rsvp=>{
        if (rsvp){
            //updates existing rsvp status
            rsvpModel.findByIdAndUpdate(rsvp._id, {rsvp:req.body.rsvp}, {useFindAndModify: false, runValidators: true})
            .then(rsvp=> {
                req.flash('success', 'RSVP has been updated successfully');
                res.redirect('/users/profile');
            })
            .catch(err=>{
                if(err.name === 'ValidationError') {
                    req.flash('error', err.message);
                    return res.redirect('/back');
                }
                next(err);
            });
        } else{
            //creates new rsvp status
            let rsvp = new rsvpModel({
                connection: id,
                rsvp: req.body.rsvp,
                user: req.session.user
            });
            rsvp.save()
            .then(rsvp=> {
                req.flash('success', 'RSVP has been created successfully');
                res.redirect('/users/profile');
            })
            .catch(err=>{
                req.flash('error', err.message);
                next(err);
            });
        }
    })
} 

exports.deleteRSVP = (req, res, next) =>{ //deletes rsvp
    let id = req.params.id;
    rsvpModel.findOneAndDelete({connection:id, user:req.session.user})
    .then(rsvp=>{
        req.flash('success', 'RSVP has been deleted successfully');
        res.redirect('/users/profile');
    })
    .catch(err=>{
        req.flash('error', err.message);
        next(err);
    });
}
