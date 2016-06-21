var mongoose = require("mongoose");

var action = mongoose.model('action', {
  type: String,
  time: Date,
  user: Object
});

module.exports = action;
