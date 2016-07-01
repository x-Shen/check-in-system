var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    User = require('../model/usersModel'),
    moment = require('moment');
Action = require('../model/actionModel');
Schedule = require('../model/scheduleModel');

router.post('/checkin', function (req, res) {

    var now = moment(); //Capture the current moment
    var nowDate = now.local().toDate(); //Convert the moment to a date object
    var date = nowDate.getDate();
    var bufferTime = 6 * 60 * 1000; //6 minutes in milliseconds

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
            newAction.type.push('checkin');
            newAction.user = {_id: result._id, name: result.name};
            newAction.createdAt = nowDate;
            var today = moment().startOf('day');
            var tomorrow = moment(today).add(1, 'days');

            Action.findOne({'user._id': result._id}, {}, {sort: {'createdAt': -1}}, function (err, actions) {

                var match_schedule = function (newAction, nowDate) {
                    Schedule.find({'user._id': newAction.user._id, start: {"$gte": today.toDate(), "$lt": tomorrow.toDate()}}, {}, {sort:{'start': -1}}, function (err, shifts) {

                        if (shifts.length === 1) {

                            var shift = shifts[0];

                            if (shift.end.getTime() - nowDate.getTime() <= bufferTime) {

                                // STOP CHECKIN
                                res.status(201);
                                res.json({
                                    status: 201,
                                    err: "You shift is about to end"
                                })
                            }
                            else if (Math.abs(nowDate.getTime() - shift.start.getTime()) <= bufferTime) {

                                newAction.save();
                                res.status(200);
                                res.json({
                                    status: 200,
                                    message: "Successfully Checked In",
                                    token: result.name

                                })
                            }
                            else {

                                newAction.type.push('late');
                                newAction.save();
                                res.status(200);
                                res.json({
                                    status: 200,
                                    message: "Successfully Checked In Late",
                                    token: result.name
                                })
                            }
                        }
                    })
                };
                if (actions == null) {
                    match_schedule(newAction,nowDate);
                }
                else if (actions.type.indexOf('checkout') != -1) {

                        match_schedule(newAction,nowDate);

                }

                else {
                    res.status(201);
                    res.json({
                        status: 201,
                        err: "User is Checked In"
                    });
                }
            });
        }
    });
});


router.post('/checkout', function (req, res) {
    var now = moment();
    var nowDate = now.local().toDate();

    User.findOne(req.body, function (err, result) {

        if (err) {
            throw err;
        }
        else if (result == null) { //Didnt find a user
            //return to browser
            res.status(202);

            //return to controller
            res.json({
                status: 202,
                message: "No user found with that ID"
            });
        }
        else if (result) { //found a user
            //Compare checkin and checkout counts to see whether or not to checkout
            //If the number of checkin is the same than the number of checkout for a user, then the person did not checkin yet.
            Action.count({type: "checkout", "user.name": result.name}, function (err, checkoutcount) {
                Action.count({type: "checkin", "user.name": result.name}, function (err, checkincount) {
                    console.log(result.name + " Checkout: " + checkoutcount + " Checkin: " + checkincount);
                    if (err) {
                        throw err;
                    }
                    else if (checkincount > checkoutcount) {
                        //do checkout and compare calendar here
                        //make the checkout object
                        var newAction = new Action({
                            type: "checkout",
                            createdAt: nowDate,
                            user: {studentId: result.studentId, name: result.name}
                        });

                        newAction.save(function (err, doc) {
                            if (err) {
                                throw err;
                            }
                            console.log(nowDate);
                            res.status(200);
                            res.json({
                                status: 200,
                                message: "Successfully Checked Out",
                                token: result.name
                            });
                        });
                    }
                    else {
                        //can't do checkout since no checkin action available
                        console.log("User has not checked in");
                        res.status(201);
                        res.json({status: 201, message: "User Has Not Checked In"});
                    }
                });
            });
        }
    });
});


// encapsulated code can be used in other files
module.exports = router;
