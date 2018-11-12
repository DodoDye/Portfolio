var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    'mailAddress': String,
    'auth': Object,
    'firstName': String,
    'lastName': String,
    'tosAgreement' : Boolean,
});

module.exports = mongoose.model('User', userSchema);