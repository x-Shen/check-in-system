var express             = require('express'),
    router              = express.Router(),
    mongoose            = require('mongoose'),
    users               = require('../model/usersModel'),
    User                = mongoose.model('user', users),
    moment              = require('moment');

moment().format();

router.post('/checkin', function(req, res) {

    User.findOne(req.body, function(err,result){

        var now = moment(); //Capture the current moment
        var nowDate = now.local().toDate(); //Convert the moment to a date object

        if (result == null) {
            res.status(202);
            res.json({
                status : 202
            });
        }
        else if(result){
            if(result.time.length == 0) {
                User.findOneAndUpdate(
                    req.body,
                    {
                        $push: {
                            time: {
                                checkin: nowDate,
                                checkout: null
                            }
                        }
                    },
                    function (err, result) {
                        if (err) {
                            console.log("Err: " + err);
                            res.json(400);
                            res.json({
                                status: 400
                            });
                        } else {
                            console.log("Done");
                            res.status(200);
                            res.json({
                                status: 200,
                                token: result.name
                            });
                        }
                    });
            }else if( result.time[result.time.length - 1].checkin == null) {
                    User.findOneAndUpdate(
                        req.body,
                        {
                            $push: {
                                time: {
                                    checkin: nowDate,
                                    //checkinString: nowString,
                                    checkout: null
                                }
                            }
                        },
                        function (err, result) {
                            if (err) {
                                console.log("Err: " + err);
                                res.status(400);
                                res.json({
                                    status: 400
                                });
                            } else {
                                console.log("Done");
                                res.status(200);
                                res.json({
                                    status: 200,
                                    token: result.name
                                });
                            }
                        }
                    );
            }else if(result.time[result.time.length - 1].checkout != null ){

                User.findOneAndUpdate(
                    req.body,
                    {$push:
                        {
                            time:
                            {
                                checkin : nowDate,
                                checkout: null
                            }
                        }
                    },
                    function(err,result){
                        if(err){
                            console.log("Err: "+ err);
                            res.status(400);
                            res.json({
                                status : 400
                            });
                        }else {
                            console.log("Done");
                            res.status(200);
                            res.json({
                                status : 200,
                                token: result.name
                            });
                        }
                    }
                );
            }
            else{
                console.log("not null");
                res.status(201);
                res.json({
                    status: 201,
                    err : "User is Checked In"
                });
            }//end else
         }
    })

});

router.post('/checkout' ,function(req,res){
    var now = moment();
    var nowDate = now.local().toDate();

    User.findOne(req.body, function (err, result) {
        if (!result) {
            //return to browser
            res.status(202);

            //return to controller
            res.json({
                status : 202,
                message : "No user found with that ID"
            });
        }
        else if(result){
            if(result.time[result.time.length - 1].checkin != null && result.time[result.time.length - 1].checkout != null){
                console.log("User has not checked in");
                res.status(201);
                res.json({status:201, message : "User Has Not Checked In"});
            }
            else if(result.time[result.time.length -1].checkout == null){
                result.time[result.time.length - 1].checkout = nowDate;
                result.save();
                res.status(200);
                res.json({status:200,
                    message: "Successfully Checked Out",
                    token: result.name});
            }
            else{
                res.status(202);
                res.json({status:202,
                    message: "No user found with that ID"});
            }
        }
    });
});

// encapsulated code can be used in other files
module.exports = router;