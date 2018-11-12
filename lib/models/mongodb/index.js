/*
 * Library for storing and editing data in MongoDB
 *
 */

// Dependencies
var fs = require('fs');
var path = require('path');
var helpers = require('./../../helpers');
var config = require('./../../config');
var mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
var dbConfig = config.dbConfig;
mongoose.connect(dbConfig.url, dbConfig.parser).catch(function(err){
    console.log(err);
});

var models = {
    'users' : require('./users'),
    'tokens' : require('./tokens'),
};

// Container for module (to be exported)
var lib = {};

// Write data to a file
lib.create = function(model, dataToStore, callback){
    var modelObject = new models[model](dataToStore);

    modelObject.save(function(err){
        if(!err){
            callback(false);
        } else {
            callback('Could not create object in database.');
        }
    });
};

// Read data from a file
lib.read = function(model, dataToFind, callback){
    models[model].findOne(dataToFind, function (err, docs) {
        if(!err && typeof(docs) == 'object' && docs != {}){
            var parsedData = helpers.parseStrToObject(docs);
            callback(false, parsedData);
        } else {
            callback(err, false);
        }
    });
};

// Update data in a file
lib.update = function(model, condition, update, callback){
    models[model].findOneAndUpdate(condition, update, function(err){
        if(!err){
            callback(false);
        } else {
            callback(err);
        }
    });
};

// Delete a file
lib.delete = function(model, condition, callback){

    models[model].findOneAndRemove(condition, function(err){
        if(!err){
            callback(false);
        } else {
            callback(err);
        }
    });

};

// List all the items in a directory
/*lib.list = function(dir,callback){
  fs.readdir(lib.baseDir+dir+'/', function(err,data){
    if(!err && data && data.length > 0){
      var trimmedFileNames = [];
      data.forEach(function(fileName){
        trimmedFileNames.push(fileName.replace('.json',''));
      });
      callback(false,trimmedFileNames);
    } else {
      callback(err,data);
    }
  });
};*/

// Export the module
module.exports = lib;
