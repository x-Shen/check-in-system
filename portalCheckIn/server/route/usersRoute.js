var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    users = require('../model/usersModel'),
    User = mongoose.model('user', users),
    moment = require('moment');

var actions = require('../model/actionModel');
var Action = mongoose.model('action', actions);

moment().format();
// This function is very messy. Rewrite the logic
router.post('/checkin', function (req, res) {

    var now = moment(); //Capture the current moment
    var nowDate = now.local().toDate(); //Convert the moment to a date object
    var date = nowDate.getDate();
    User.findOne(req.body, function (err, result) {
        //if user id does not exist, send an alert.
        if (result == null) {
            res.status(202);
            res.json({
                status: 202
            });
        }
        else {
            var newAction = new Action();
            newAction.actionType = 'checkin';
            newAction.user = {studentId: result.studentId, name: result.name};
            newAction.createdAt = nowDate;
            var userid = result.studentId;
            Action.count({actionType: 'checkin',"user.studentId": userid}, function (err, checkincount) {
                Action.count({actionType: 'checkout',"user.studentId": userid}, function (err, checkoutcount) {
                    if (checkincount == checkoutcount) {
                        //if the user is not checked in, check the user in
                        newAction.save();
                        res.status(200);
                        res.json({
                            status: 200,
                            token: result.name
                        });
                    }
                    else {
                        // if user is already checked in, alert the user and not check in again
                        res.status(201);
                        res.json({
                            status: 201,
                            err : "User is Checked In"
                        });
                    }
                })
            });
        }
    });
});

router.post('/checkout' ,function(req,res){
   var now = moment();
   var nowDate = now.local().toDate();

    User.findOne(req.body, function (err, result) {
        console.log(result);
        if (err){
            throw err;
        }
        else if (result == null) { //Didnt find a user
            //return to browser
            res.status(202);

            //return to controller
            res.json({
                status : 202,
                message : "No user found with that ID"
            });
        }
        else if (result){ //found a user
            //Compare checkin and checkout counts to see whether or not to checkout
            //If the number of checkin is the same than the number of checkout for a user, then the person did not checkin yet.
            Action.count({actionType: "checkout", "user.name": result.name}, function(err, checkoutcount){
                Action.count({actionType: "checkin", "user.name": result.name}, function(err, checkincount){
                    console.log(result.name + " Checkout: " + checkoutcount + " Checkin: " + checkincount);
                    if (err){
                        throw err;
                    }
                    else if (checkincount > checkoutcount){
                        //do checkout and compare calendar here
                        //make the checkout object
                        var newAction = new Action({
                            actionType: "checkout",
                            createdAt: nowDate,
                            user: {studentId: result.studentId, name: result.name}
                        });

                        newAction.save(function(err, doc){
                            if (err){
                                throw err;
                            }
                            console.log(nowDate);
                            res.status(200);
                            res.json({status:200,
                                message: "Successfully Checked Out",
                                token: result.name});
                        });
                    }
                    else{
                        //can't do checkout since no checkin action available
                        console.log("User has not checked in");
                        res.status(201);
                        res.json({status:201, message : "User Has Not Checked In"});
                    }
                });
            });
        }
    });
});


// encapsulated code can be used in other files
module.exports = router;
