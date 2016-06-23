var mongoose = require('mongoose');
actionSchema = mongoose.Schema({
    actionType: String,
    user: {studentId: Number, name: String},
    createdAt: Date,
    comments: Array,
    extras: Object
});
var action = mongoose.model("action", actionSchema);
module.exports = action;
