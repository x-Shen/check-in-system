<<<<<<< HEAD
var mongoose = require('mongoose');
actionSchema = mongoose.Schema({
    actionType: String,
    user: {studentId: Number, name: String},
=======
/**
 * Created by xinshen on 6/21/16.
 */
var mongoose = require('mongoose');

actionSchema = mongoose.Schema({
    actionType: String,
    //whether we need id?
    user: {
        studentId:Number,
        name:String
    },
>>>>>>> upstream/master
    createdAt: Date,
    comments: Array,
    extras: Object
});
<<<<<<< HEAD
=======

>>>>>>> upstream/master
var action = mongoose.model("action", actionSchema);
module.exports = action;
