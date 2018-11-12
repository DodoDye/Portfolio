/*
 * Request Handlers
 *
 */

// Dependencies
var mongoose = require('mongoose');
var helpers = require('./helpers');
var config = require('./config');
var https = require('https');
var oauthClientSecret = require('../clientSecret');

var models = './models/' + (config.models || 'pirple');

var _data = require(models);

// Define all the handlers
var handlers = {};

/*
 * HTML Handlers
 *
 */

// Index
handlers.index = function(data, callback){
  // Reject any request that isn't a GET
  if(data.method == 'get'){
    // Prepare data for interpolation
    var bodyClass = 'index';
    var templateData = {
      'head.title' : 'Présentation',
      'head.description' : 'Mise en pratique de mes compétences.',
      'head.author' : 'Dorian Souleyreau',
      'head.script' : 'js/' + bodyClass + '.js',
      'head.style' : 'css/' + bodyClass + '.css',
      'body.class' : bodyClass,
    };
    // Read in a template as a string
    helpers.getTemplate('index', templateData, function(err,str){
      if(!err && str){
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err,str){
          if(!err && str){
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Account Management
handlers.account = function(data,callback){
  var acceptableActions = {'create' : 'accountCreate', 'edit' : 'accountEdit', 'deleted' : 'accountDeleted'};
  
  // Get the action being requested
  var trimmedSelectedAction = data.trimmedPath.replace('account/', '').trim();
  var selectedAction = acceptableActions[trimmedSelectedAction];
  
  if(typeof(selectedAction) == 'string'){
    handlers._account[selectedAction](data, callback);
  } else {
    callback(405);
  }
};

// Container for all the account actions
handlers._account = {};

// Create Account
handlers._account.accountCreate = function(data, callback){
  // Reject any request that isn't a GET
  if(data.method == 'get'){
    // Prepare data for interpolation
    var bodyClass = 'accountCreate';
    var templateData = {
      'head.title' : 'Création de compte',
      'head.description' : 'Créer un compte est facile et ne prends que quelques secondes.',
      'head.author' : 'Dorian Souleyreau',
      'head.script' : 'js/' + bodyClass + '.js',
      'head.style' : 'css/' + bodyClass + '.css',
      'body.class' : bodyClass,
    };
    // Read in a template as a string
    helpers.getTemplate('accountCreate', templateData, function(err, str){
      if(!err && str){
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, str){
          if(!err && str){
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Edit Your Account
handlers._account.accountEdit = function(data, callback){
  // Reject any request that isn't a GET
  if(data.method == 'get'){
    // Prepare data for interpolation
    var bodyClass = 'accounEdit';
    var templateData = {
      'head.title' : 'Paramètres du compte',
      'head.description' : 'Modifiez vos informations à votre guise. Attention, la suppression du compte est définitive.',
      'head.author' : 'Dorian Souleyreau',
      'head.script' : 'js/' + bodyClass + '.js',
      'head.style' : 'css/' + bodyClass + '.css',
      'body.class' : bodyClass,
    };
    // Read in a template as a string
    helpers.getTemplate('accountEdit', templateData, function(err, str){
      if(!err && str){
        // Add the universal header and footer
        helpers.addUniversalTemplates(str,templateData,function(err,str){
          if(!err && str){
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Account has been deleted
handlers._account.accountDeleted = function(data, callback){
  // Reject any request that isn't a GET
  if(data.method == 'get'){
    var bodyClass = 'accountDeleted';
    // Prepare data for interpolation
    var templateData = {
      'head.title' : 'Compte supprimé',
      'head.description' : 'Votre compte a bien été supprimé.',
      'head.author' : 'Dorian Souleyreau',
      'head.script' : 'js/' + bodyClass + '.js',
      'head.style' : 'css/' + bodyClass + '.css',
      'body.class' : bodyClass,
    };
    // Read in a template as a string
    helpers.getTemplate('accountDeleted', templateData, function(err, str){
      if(!err && str){
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData ,function(err, str){
          if(!err && str){
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Session Management
handlers.session = function(data, callback){
  var acceptableActions = {'create' : 'sessionCreate', 'deleted' : 'sessionDeleted'};
  
  // Get the action being requested
  var trimmedSelectedAction = data.trimmedPath.replace('session/', '').trim();
  var selectedAction = acceptableActions[trimmedSelectedAction];
  
  if(typeof(selectedAction) == 'string'){
    handlers._session[selectedAction](data, callback);
  } else {
    callback(405);
  }
};

// Container for all the session actions
handlers._session = {};

// Create New Session
handlers._session.sessionCreate = function(data, callback){
  // Reject any request that isn't a GET
  if(data.method == 'get'){
    var bodyClass = 'sessionCreate';
    // Prepare data for interpolation
    var templateData = {
      'head.title' : 'Connexion',
      'head.description' : 'Choisissez votre moyen de connexion.',
      'head.author' : 'Dorian Souleyreau',
      'head.script' : 'js/' + bodyClass + '.js',
      'head.style' : 'css/' + bodyClass + '.css',
      'body.class' : bodyClass,
    };
    // Read in a template as a string
    helpers.getTemplate('sessionCreate', templateData, function(err, str){
      if(!err && str){
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, str){
          if(!err && str){
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Session has been deleted
handlers._session.sessionDeleted = function(data, callback){
  // Reject any request that isn't a GET
  if(data.method == 'get'){
    var bodyClass = 'sessionDeleted';
    // Prepare data for interpolation
    var templateData = {
      'head.title' : 'Déconnexion',
      'head.description' : 'Vous avez été déconnecté.',
      'head.author' : 'Dorian Souleyreau',
      'head.script' : 'js/' + bodyClass + '.js',
      'head.style' : 'css/' + bodyClass + '.css',
      'body.class' : bodyClass,
    };
    // Read in a template as a string
    helpers.getTemplate('sessionDeleted', templateData, function(err,str){
      if(!err && str){
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, str){
          if(!err && str){
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Favicon
handlers.favicon = function(data, callback){
  // Reject any request that isn't a GET
  if(data.method == 'get'){
    // Read in the favicon's data
    helpers.getStaticAsset('favicon.ico', function(err, data){
      if(!err && data){
        // Callback the data
        callback(200, data, 'favicon');
      } else {
        callback(500);
      }
    });
  } else {
    callback(405);
  }
};

// Public assets
handlers.public = function(data, callback){
  // Reject any request that isn't a GET
  if(data.method == 'get'){
    // Get the filename being requested
    var trimmedAssetName = data.trimmedPath.replace('public/', '').trim();
    if(trimmedAssetName.length > 0){
      // Read in the asset's data
      helpers.getStaticAsset(trimmedAssetName,function(err, data){
        if(!err && data){

          // Determine the content type (default to plain text)
          var contentType = 'plain';

          if(trimmedAssetName.indexOf('.html') > -1){
            contentType = 'html';
          }

          if(trimmedAssetName.indexOf('.css') > -1){
            contentType = 'css';
          }

          if(trimmedAssetName.indexOf('.png') > -1){
            contentType = 'png';
          }

          if(trimmedAssetName.indexOf('.jpg') > -1){
            contentType = 'jpg';
          }

          if(trimmedAssetName.indexOf('.ico') > -1){
            contentType = 'favicon';
          }

          // Callback the data
          callback(200, data, contentType);
        } else {
          callback(404);
        }
      });
    } else {
      callback(404);
    }

  } else {
    callback(405);
  }
};

/*
 * JSON API Handlers
 *
 */

// Ping
handlers.ping = function(data, callback){
    callback(200);
};

// Not-Found
handlers.notFound = function(data, callback){
  callback(404);
};

// API Management
handlers.api = function(data, callback){
  var acceptableAPIs = ['users', 'tokens'];
  
  // Get the API being requested
  var trimmedSelectedAPI = data.trimmedPath.replace('api/', '').trim();
  
  if(acceptableAPIs.indexOf(trimmedSelectedAPI) > -1){
    handlers[trimmedSelectedAPI](data, callback);
  } else {
    callback(405);
  }
};


// Users
handlers.users = function(data, callback){
  var acceptableMethods = ['post', 'get', 'put', 'delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for all the users methods
handlers._users  = {};

// Users - post
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
handlers._users.post = function(data, callback){
    // Check that all required fields are filled out
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var mailAddress = typeof(data.payload.mailAddress) == 'string' && /\S+@\S+\.\S+/.test(data.payload.mailAddress) ? data.payload.mailAddress.trim() : false;
    var auth = typeof(data.payload.auth) == 'object' && data.payload.auth != {} ? data.payload.auth : {};
    var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;
    
    if(firstName && lastName && mailAddress && auth.password && tosAgreement){
        // Make sure the user doesnt already exist
        _data.read('users', {'mailAddress' : mailAddress, 'auth' : {'type' : auth.type}}, function(err, data){
        if(!err && data == {}){
            // Hash the password
            var hashedPassword = helpers.hash(auth.password);

            // Create the user object
            if(hashedPassword){
                var userObject = {
                    'mailAddress' : mailAddress,
                    'auth' : {'type' : auth.type, 'hashedPassword' : hashedPassword},
                    'firstName' : firstName,
                    'lastName' : lastName,
                    'tosAgreement' : tosAgreement,
                };

                // Store the user
                _data.create('users', userObject, function(err){
                    if(!err){
                        callback(200);
                    } else {
                        callback(500, {'Error' : 'Echec de la création de l\'utilisateur.'});
                    }
                });
            } else {
                callback(500, {'Error' : 'Echec de la sécurisation du mot de passe.'});
            }

        } else if(data){
            // User alread exists
            callback(400, {'Error' : 'Un utilisateur avec cette adresse mail existe déjà'});
        } else {
            callback(400, {'Error' : 'Echec de la création de l\'utilisateur.'});
        }
        });

    } else {
        callback(400, {'Error' : 'Champ(s) manquant(s) ou invalide(s)'});
    }
};

// Required data: phone
// Optional data: none
handlers._users.get = function(data, callback){
  // Check that phone number is valid
  var mailAddress = typeof(data.queryStringObject.mailAddress) == 'string' && /\S+@\S+\.\S+/.test(data.queryStringObject.mailAddress) ? data.queryStringObject.mailAddress.trim() : false;
  var auth = typeof(data.queryStringObject.auth) == 'object' && data.queryStringObject.auth != {} ? data.queryStringObject.auth : {};
  var userId = typeof(data.queryStringObject.user) == 'string' && data.queryStringObject.user.trim().length > 0 ? data.queryStringObject.user.trim() : false;
  if(!(mailAddress && auth.type) && userId){
      _data.read('users', {'_id' : userId}, function(err,docs){
        if(!err && docs){
          // Remove the hashed password from the user object
          delete docs.auth.hashedPassword;
          mailAddress = typeof(docs.mailAddress) == 'string' && /\S+@\S+\.\S+/.test(docs.mailAddress) ? docs.mailAddress.trim() : false;
          auth = typeof(docs.auth) == 'object' && docs.auth != {} ? docs.auth : {};
          if(mailAddress && auth.type){

            // Get token from headers
            var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
            // Verify that the given token is valid for the phone number
            handlers._tokens.verifyToken(token, function(tokenIsValid){
              if(tokenIsValid){
                // Lookup the user
                _data.read('users', {'mailAddress' : mailAddress, 'auth' : {'type' : auth.type}},function(err, docs){
                  if(!err && docs){
                    // Remove the hashed password from the user object before returning it to the requester
                    delete docs.auth.hashedPassword;
                    callback(200, docs);
                  } else {
                    callback(404);
                  }
                });
              } else {
                callback(403, {'Error' : 'Jeton invalide ou manquant dans l\'en-tête.'});
              }
            });
          } else {
            callback(400, {'Error' : 'Champ manquant ou invalide.'});
          }
        } else {
          callback(404, {'Error' : 'Utilisateur introuvable à partir de ce jeton.'});
        }
      });
  } else {
    // Get token from headers
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    // Verify that the given token is valid for the phone number
    handlers._tokens.verifyToken(token, function(tokenIsValid){
      if(tokenIsValid){
        // Lookup the user
        _data.read('users', {'mailAddress' : mailAddress, 'auth' : {'type' : auth.type}},function(err, docs){
          if(!err && docs){
            // Remove the hashed password from the user object before returning it to the requester
            delete docs.auth.hashedPassword;
            callback(200, docs);
          } else {
            callback(404);
          }
        });
      } else {
        callback(403, {'Error' : 'Jeton invalide ou manquant dans l\'en-tête.'})
      }
    });
  }
};

// Required data: mailAddress
// Optional data: firstName, lastName, password (at least one must be specified)
handlers._users.put = function(data, callback){
  // Check for required field
  var mailAddress = typeof(data.payload.mailAddress) == 'string' && /\S+@\S+\.\S+/.test(data.payload.mailAddress) ? data.payload.mailAddress.trim() : false;

  // Check for optional fields
  var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

  // Error if phone is invalid
  if(mailAddress){
    // Error if nothing is sent to update
    if(firstName || lastName || password){

      // Get token from headers
      var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

      // Verify that the given token is valid for the phone number
      handlers._tokens.verifyToken(token, function(tokenIsValid){
        if(tokenIsValid){

          // Lookup the user
          _data.read('users', {'mailAddress' : mailAddress}, function(err, userData){
            if(userData.auth.type != 'portfolio'){
              if(!err && userData){
                // Update the fields if necessary
                if(firstName){
                  userData.firstName = firstName;
                }
                if(lastName){
                  userData.lastName = lastName;
                }
                if(password){
                  userData.auth.hashedPassword = helpers.hash(password);
                }
                // Store the new updates
                _data.update('users', {'mailAddress' : mailAddress, 'auth' : {'type' : 'portfolio'}}, userData, function(err){
                  if(!err){
                    callback(200);
                  } else {
                    callback(500, {'Error' : 'Echec de la modification de l\'utilisateur.'});
                  }
                });
              } else {
                callback(400, {'Error' : 'Utilisateur introuvable.'});
              }
            } else {
                callback(400, {'Error' : 'Echec de la modification de l\'utilisateur'});
            }
          });
        } else {
          callback(403, {'Error' : 'Jeton invalide ou manquant dans l\'en-tête.'});
        }
      });
    } else {
      callback(400, {'Error' : 'Champ à modifier manquant ou invalide.'});
    }
  } else {
    callback(400, {'Error' : 'Champ(s) manquant(s) ou invalide(s).'});
  }

};

// Required data: phone
// Cleanup old checks associated with the user
handlers._users.delete = function(data,callback){
  // Check that phone number is valid
  var mailAddress = typeof(data.queryStringObject.mailAddress) == 'string' && /\S+@\S+\.\S+/.test(data.queryStringObject.mailAddress) ? data.queryStringObject.mailAddress.trim() : false;
  var auth = typeof(data.queryStringObject.auth) == 'object' && data.queryStringObject.auth != {} ? data.queryStringObject.auth : {};
  if(mailAddress && auth.type){

    // Get token from headers
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

    // Verify that the given token is valid for the phone number
    handlers._tokens.verifyToken(token, function(tokenIsValid){
      if(tokenIsValid){
        // Lookup the user
        _data.read('users', {'mailAddress' : mailAddress, 'auth' : {'type' : auth.type}}, function(err, userData){
          if(!err && userData){
            // Delete the user's data
            _data.delete('users', {'mailAddress' : mailAddress, 'auth' : {'type' : auth.type}}, function(err){
              if(!err){
                callback(200);
              } else {
                callback(500, {'Error' : 'Echec de la suppression de l\'utilisateur'});
              }
            });
          } else {
            callback(400, {'Error' : 'Utilisateur introuvable.'});
          }
        });
      } else {
        callback(403, {'Error' : 'Jeton invalide ou manquant dans l\'en-tête.'});
      }
    });
  } else {
    callback(400, {'Error' : 'Champ manquant ou invalide.'})
  }
};

// Tokens
handlers.tokens = function(data, callback){
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._tokens[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Container for all the tokens methods
handlers._tokens  = {};

// Tokens - post
// Required data: mailAddress, password
// Optional data: none
handlers._tokens.post = function(data, callback){
  var mailAddress = typeof(data.payload.mailAddress) == 'string' && /\S+@\S+\.\S+/.test(data.payload.mailAddress) ? data.payload.mailAddress.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  var auth = typeof(data.payload.auth) == 'object' && data.payload.auth != {} ? data.payload.auth : {};
  if(mailAddress && auth.type){
    // Lookup the user who matches that mailAddress
    _data.read('users', {'mailAddress' : mailAddress, 'auth' : {'type' : auth.type}}, function(err, userData){
      if(!err && userData){
        // Hash the sent password, and compare it to the password stored in the user object
        var hashedPassword = helpers.hash(password);
        if(hashedPassword == userData.auth.hashedPassword){
          // If valid, create a new token with a random name. Set an expiration date 1 hour in the future.
          var tokenId = helpers.createRandomString(20);
          var expires = helpers.getDate(1000 * 60 * 60);

          var tokenObject = {
            'user' : userData._id,
            'id' : tokenId,
            'expires' : expires
          };

          // Store the token
          _data.create('tokens', tokenObject, function(err){
            if(!err){
              callback(200, tokenObject);
            } else {
              callback(500, {'Error' : 'Echec de la création du jeton d\'accès.'});
            }
          });
        } else {
          callback(400, {'Error' : 'Mot de passe invalide.'});
        }
      } else {
        callback(400, {'Error' : 'Adresse mail invalide.'});
      }
    });
  } else {
    callback(400, {'Error' : 'Champ(s) manquant(s) ou invalide(s).'})
  }
};

// Tokens - get
// Required data: id
// Optional data: none
handlers._tokens.get = function(data, callback){
  // Check that id is valid
  var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  if(id){
    // Lookup the token
    _data.read('tokens', {'id' : id}, function(err, tokenData){
      if(!err && tokenData){
        callback(200, tokenData);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, {'Error' : 'Champ manquant ou invalide.'});
  }
};

// Tokens - put
// Required data: id, extend
// Optional data: none
handlers._tokens.put = function(data, callback){
  var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
  var extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;
  if(id && extend){
    // Lookup the existing token
    _data.read('tokens', {'id' : id }, function(err, tokenData){
      if(!err && tokenData){
        // Check to make sure the token isn't already expired
        if(tokenData.expires > Date.now()){
          // Set the expiration an hour from now
          tokenData.expires = helpers.getDate(1000 * 60 * 60);
          // Store the new updates
          _data.update('tokens', {'id': tokenData.id}, tokenData, function(err){
            if(!err){
              callback(200, tokenData);
            } else {
              callback(500, {'Error' : 'Echec de la prolongation du jeton.'});
            }
          });
        } else {
          callback(400, {'Error' : 'Le jeton a déjà expiré ou ne peut pas être prolongé.'});
        }
      } else {
        callback(400, {'Error' : 'Echec de la récupération du jeton spécifié.'});
      }
    });
  } else {
    callback(400, {"Error": 'Champ(s) manquant(s) ou invalide(s).'});
  }
};

// Tokens - delete
// Required data: id
// Optional data: none
handlers._tokens.delete = function(data, callback){
  // Check that id is valid
  var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  if(id){
    // Lookup the token
    _data.read('tokens', {'id' : id }, function(err, tokenData){
      if(!err && tokenData){
        // Delete the token
        _data.delete('tokens', {'id' : tokenData.id}, function(err){
          if(!err){
            callback(200);
          } else {
            callback(500, {'Error' : 'Echec de la création du jeton.'});
          }
        });
      } else {
        callback(400, {'Error' : 'Echec de la récupération du jeton spécifié.'});
      }
    });
  } else {
    callback(400, {'Error' : 'Champ manquant ou invalide.'});
  }
};

// Verify if a given token id is currently valid for a given user
handlers._tokens.verifyToken = function(token, callback){
  // Lookup the token
  _data.read('tokens', {'id' : token}, function(err, tokenData){
    if(!err && tokenData){
      // Check that the token is for the given user and has not expired
      if(tokenData.expires > Date.now()){
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

// Oauth Management
handlers.oauth = function(data, callback){  
  // Get the action being requested
  var selectedAction = data.trimmedPath.match(/oauth\/(facebook|google).?/)[1];
  
  if(typeof(selectedAction) == 'string'){
    handlers[selectedAction](data, callback);
  } else {
    callback(405);
  }
};

// Facebook oauth Management
handlers.facebook = function(data, callback){
  var acceptableActions = ['callback', 'redirect'];
  
  // Get the action being requested
  var trimmedSelectedAction = data.trimmedPath.replace('oauth/facebook/','').trim();
  
  if(acceptableActions.indexOf(trimmedSelectedAction) > - 1){
    handlers._facebook[trimmedSelectedAction](data, callback);
  } else {
    callback(405);
  }
};

// Container for all the Facebook oauth actions
handlers._facebook = {};

// Get callback with oauth code
handlers._facebook.callback = function(data, callback){
  var code = typeof(data.queryStringObject.code) == 'string' ? data.queryStringObject.code.trim() : false;
  if(code){
    
    https.get('https://graph.facebook.com/v3.1/oauth/access_token?client_id=304599826798461&client_secret=' + oauthClientSecret + '&code=' + code + '&redirect_uri=https://doriansouleyreau.fr/oauth/facebook/callback', function(resp){
      var data2 = '';

      // A chunk of data has been recieved.
      resp.on('data', function(chunk){
        data2 += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', function(){
        var tokenData = helpers.parseJsonToObject(data2);
        var access_token = typeof(tokenData.access_token) == 'string' ? tokenData.access_token.trim() : false;
        if(access_token){
          https.get('https://graph.facebook.com/v3.1/me?fields=id%2Cname%2Cemail&access_token=' + access_token, function(resp){
            var data3 = '';

            // A chunk of data has been recieved.
            resp.on('data', function(chunk){
              data3 += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', function(){
              var userData = helpers.parseJsonToObject(data3);
              
              var postData = {};
              postData.mailAddress = typeof(userData.email) == 'string' && /\S+@\S+\.\S+/.test(userData.email) ? userData.email.trim() : false;
              var displayName = userData.name.split(' ');
              postData.firstName = typeof(displayName[0]) == 'string' && displayName[0].trim().length > 0 ? displayName[0].trim() : false;
              postData.lastName = typeof(displayName[displayName.length - 1]) == 'string' && displayName[displayName.length - 1].trim().length > 0 ? displayName[displayName.length - 1].trim() : false;
              var password = typeof(userData.id) == 'string' && userData.id.trim().length > 0 ? userData.id : false;
              postData.auth = {'type' : 'facebook', 'password' : password};
              postData.tosAgreement = true;

              if(postData.mailAddress && password){
                postData = JSON.stringify(postData);
                var postReq = https.request({'hostname' : 'doriansouleyreau.fr', 'port' : 443, 'path' : '/api/users', 'method' : 'POST', 'headers' : {'Content-Type' : 'application/json', 'Content-Length' : postData.length}}, function(resp){
                  var data4 = '';

                  // A chunk of data has been recieved.
                  resp.on('data', function(chunk){
                    data4 += chunk;
                  });

                  // The whole response has been received. Print out the result.
                  resp.on('end', function(){
                    var error = helpers.parseJsonToObject(data4);
//                    if(error['Error']){
//                        
//                    } else {
//                    }
                    callback(301, '', 'html', {'Location' : 'https://doriansouleyreau.fr/oauth/facebook/redirect?error=' + encodeURIComponent(JSON.stringify(error))});
                  });
                }).on("error", function(err){
                  console.log("Error: " + err.message);
                  callback(400, {'Error' : 'Echec de la création de l\'utilisateur.'});
                });

                postReq.write(postData);
                postReq.end();
              } else {
                callback(500, {'Error' : 'Echec de la récupération de l\'utilisateur Facebook.'});
              }
            });
          }).on("error", function(err){
            console.log("Error: " + err.message);
            callback(400, {'Error' : 'Echec de la récupération du jeton d\'accès.'});
          });
        } else {
          callback(400, {'Error' : 'Echec de la récupération du code d\'authentification.'});
        }
      });
    }).on("error", function(err){
      console.log("Error: " + err.message);
      callback(400, {'Error' : 'Echec de la récupération du code d\'authentification.'});
    });
  } else {
    callback(400,{"Error": 'Champ manquant ou invalide.'});
  }
};

// Get callback with oauth code
handlers._facebook.redirect = function(data, callback){
  var error = typeof(data.queryStringObject.error) == 'string' ? helpers.parseJsonToObject(data.queryStringObject.error.trim()) : false;
  
  if(typeof(error['Error']) != 'undefined'){
      // Reject any request that isn't a GET
      if(data.method == 'get'){
        var bodyClass = 'redirect';
        // Prepare data for interpolation
        var templateData = {
/*          'head.script' : 'js/' + bodyClass + '.js',
          'head.style' : 'css/' + bodyClass + '.css',*/
          'body.error' : error['Error'],
        };
        // Read in a template as a string
        helpers.getTemplate('../public/redirect', templateData, function(err, str){
          if(!err && str){
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(405, undefined, 'html');
      }
  } else {
      handlers.notFound(data,function(statusCode){
          callback(statusCode);
      });
  }
}

// Export the handlers
module.exports = handlers;
