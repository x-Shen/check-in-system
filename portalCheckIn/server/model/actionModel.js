var mongoose = require('mongoose');
actionSchema = mongoose.Schema({
    actionType: String,
    time: Date,
    user: Object
    //actionId: Number,
    //note: String,
});
var action = mongoose.model("action", actionSchema);
module.exports = action;
