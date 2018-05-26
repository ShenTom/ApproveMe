var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

//user_id: requested, requesting 
var UserSchema = new Schema({
    user_id: String,
    requested: [],
    requesting: []
});

module.exports = mongoose.model('User', UserSchema);