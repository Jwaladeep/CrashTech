const cDetails = require('../models/ct.model'); //importing model from models/cDetails

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('TEsting here again from the Test controller!');
};


//create new collection
exports.contact_create = function (req, res) {
    let cdetails = new cDetails(
        {
            name: req.body.name,				//initialising object with values from payload
            orgname: req.body.orgname,
			email:req.body.email,
			phone:req.body.phone,
			city:req.body.city,
			registerfor:req.body.registerfor,
			appdate:req.body.appdate
        }
    );

    cdetails.save(function (err) {
        if (err) {								//obj.save equivalent to post call.
            return next(err);
        }
        res.send('Contact Created successfully') //res.send --> writes response back to client
    })
};
//find by Id
exports.contact_details = function (req, res) {
    cDetails.findById(req.params.id, function (err, cdetails) {
        if (err) return next(err);
        res.send(cdetails);
    })
};
//update by Id
exports.contact_update = function (req, res) {
    cDetails.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, cdetails) {
        if (err) return next(err);
        res.send('Contact udpated.');
    });
};
//delete by Id
exports.contact_delete = function (req, res) {
    cDetails.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};

//get all
exports.contact_getAll= function(req,res){
	cDetails.find(function(err,cdetails){if(err) return next(err);
	res.send(cdetails);
})};