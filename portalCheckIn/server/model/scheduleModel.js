/**
 * Created by xinshen on 6/28/16.
 */
var mongoose = require('mongoose');

scheduleSchema = mongoose.Schema({
    start: Date,
    end: Date,
    user: {
        studentId:Number,
        name:String
    }

});


var schedule = mongoose.model("schedule", scheduleSchema);
module.exports = schedule;
