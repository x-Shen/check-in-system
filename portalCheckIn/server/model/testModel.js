var mongoose = require("mongoose");

var user = mongoose.model('user', {
  name: String,
  //ensure student_id is unique
  student_id: {type:Number, index: { unique: true}, dropDups: true},
  //ensure email is also unique
  email: {type:String, index: { unique: true}, dropDups: true},
  isAdmin: Boolean,
  //action id is used to determine which checkin is related to which checkout
  action_id: Number,
  //change the password later
  password: String,
});

module.exports = user;
