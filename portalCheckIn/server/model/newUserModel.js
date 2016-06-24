/**
 * Created by xinshen on 6/21/16.
 */
var mongoose = require('mongoose');


//define schema
var usersSchema = mongoose.Schema({
    name: String,
    //ensure student_id is unique
    studentId: {type:Number, index: { unique: true}, dropDups: true},
    //ensure email is also unique
    email: {type:String, index: { unique: true}, dropDups: true},
    isAdmin: Boolean,
    password: String,
    phone: Number,
    housingArea: String,
    birthdate: Date,
    graduationDate: Date,
    isIntlStudent: Boolean,
    profilePic: String,
    position: String,
    employmentStart: Date,
    employmentEnd: Date,
    hasParkingPass: Boolean,
    password: String,
    hasKeys: Boolean,
    keyType: String,
    dateActivated:Date,
    dateDeactivated:Date,
    flags: Number
});

//passing in collection name, Schema
var user = mongoose.model("user", usersSchema);

module.exports = user;