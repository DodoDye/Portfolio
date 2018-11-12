var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    'mailAddress': String,
    'hashedPassword': String,
    'auth': String,
    'firstName': String,
    'lastName': String,
    'tosAgreement' : Boolean,
});

module.exports = mongoose.model('User', userSchema);