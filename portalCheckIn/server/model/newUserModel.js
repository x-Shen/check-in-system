var mongoose = require('mongoose');
//define schema
var usersSchema = mongoose.Schema({
    name: String,
    //ensure student_id is unique
    student_id: {type:Number, index: { unique: true}, dropDups: true},
    //ensure email is also unique
    email: {type:String, index: { unique: true}, dropDups: true},
    isAdmin: Boolean,
    password: String
});
//passing in collection name, Schema
var user = mongoose.model("user", usersSchema);
module.exports = user;
