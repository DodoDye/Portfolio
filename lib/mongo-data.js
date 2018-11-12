/*
 * Library for storing and editing data in MongoDB
 *
 */

// Dependencies
var fs = require('fs');
var path = require('path');
var helpers = require('./helpers');
var mongoose = require('mongoose');
var userModel = require('./models/users');
var tokenModel = require('./models/tokens');

var models = {
    'users' : userModel,
    'tokens' : tokenModel
};

// Container for module (to be exported)
var lib = {};

// Write data to a file
lib.create = function(model, data, callback){
    var dataToStore = new models[model](data);

    dataToStore.save(function(err){
        if(!err){
            callback(false);
        } else {
            console.log('err ' + err);
            callback('Could not insert data to databse.');
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
