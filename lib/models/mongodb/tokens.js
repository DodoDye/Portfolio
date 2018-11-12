var mongoose = require('mongoose');

var tokenSchema = new mongoose.Schema({
    'user' : {type : mongoose.Schema.Types.ObjectId, ref : 'User'},
    /*'mailAddress' : String,*/
    'id': String,
    'expires' : Number,
});

module.exports = mongoose.model('Token', tokenSchema);