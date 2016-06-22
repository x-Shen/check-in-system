var express             = require('express'),
    router              = express.Router(),
    mongoose            = require('mongoose'),
    users               = require('../model/usersModel'),
    User                = mongoose.model('user', users),
    actions             = require('../model/actionModel'),
    Action              = mongoose.model('action', actions),
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
    console.log(req.body);
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
          //If the number of checkin is greater than the number of checkout for a user, then the person did not checkout yet.
          Action.count({actionType: "checkout", "user.name": result.name}, function(err, checkoutcount){
            Action.count({actionType: "checkin", "user.name": result.name}, function(err, checkincount){
              console.log(result.name + " Checkout: " + checkoutcount + " Checkin: " + checkincount);
              if (err){
                throw err;
              }
              else if (checkincount > checkoutcount){
                //do checkout and compare calendar here
                //make the checkout object
                var newaction = new Action({
                  actionType: "checkout",
                  time: nowDate,
                  user: result
                });

                newaction.save(function(err, doc){
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
        // else if(result){
        //     if(result.time[result.time.length - 1].checkin != null && result.time[result.time.length - 1].checkout != null){
        //         console.log("User has not checked in");
        //         res.status(201);
        //         res.json({status:201, message : "User Has Not Checked In"});
        //     }
        //     else if(result.time[result.time.length -1].checkout == null){
        //         result.time[result.time.length - 1].checkout = nowDate;
        //         result.save();
        //
        //         res.status(200);
        //         res.json({status:200,
        //             message: "Successfully Checked Out",
        //             token: result.name});
        //     }
        //     else{
        //         res.status(202);
        //         res.json({status:202,
        //             message: "No user found with that ID"});
        //     }
        // }
});

// encapsulated code can be used in other files
module.exports = router;
