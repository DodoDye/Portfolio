/*
 * Server init
 *
 */

// Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./lib/config');
var fs = require('fs');
var handlers = require('./lib/handlers');
var helpers = require('./lib/helpers');
var path = require('path');
var mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
var dbConfig = config.dbConfig;
mongoose.connect(dbConfig.url, dbConfig.parser).catch(function(err){
    console.log(err);
});

// Instantiate the HTTP server
var httpServer = http.createServer(function(req,res){
    res.writeHead(301, {'Location': 'https://' + req.headers.host + req.url});
    res.end();
});

// Instantiate the HTTPS server
var httpsServerOptions = {
    'key': fs.readFileSync(path.join(__dirname,'./https/private.key')),
    'cert': fs.readFileSync(path.join(__dirname,'./https/certificate.crt')),
    'ca': fs.readFileSync(path.join(__dirname,'./https/ca_bundle.crt')),
};
var httpsServer = https.createServer(httpsServerOptions,function(req,res){
    var cookies = helpers.parseCookies(req);
    
    // Parse the url
    var parsedUrl = url.parse(req.url, true);

    // Get the path
    var parsedPath = parsedUrl.pathname;
    var trimmedPath = parsedPath.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object
    var queryStringObject = parsedUrl.query;

    // Get the HTTP method
    var method = req.method.toLowerCase();

    //Get the headers as an object
    var headers = req.headers;

    // Get the payload,if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data) {
        buffer += decoder.write(data);
    });
    req.on('end', function() {
        buffer += decoder.end();

        // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
        var chosenHandler;

        // If the request is within the public directory use to the public handler instead
        for(route in router){
            if(router.hasOwnProperty(route) && trimmedPath.indexOf(route) == 0){
                chosenHandler = typeof(router[route]) !== 'undefined' ? router[route] : handlers.notFound;
            }
        }

        // Construct the data object to send to the handler
        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : helpers.parseJsonToObject(buffer)
        };

        // Route the request to the handler specified in the router
        chosenHandler(data,function(statusCode, payload, contentType, headers){

            // Determine the type of response (fallback to JSON)
            contentType = typeof(contentType) == 'string' ? contentType : 'json';

            // Use the status code returned from the handler, or set the default status code to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // Return the response parts that are content-type specific
            var payloadString = '';
            if(contentType == 'json'){
                res.setHeader('Content-Type', 'application/json');
                payload = typeof(payload) == 'object' ? payload : {};
                payloadString = JSON.stringify(payload);
            }

            if(contentType == 'html'){
                res.setHeader('Content-Type', 'text/html');
                payloadString = typeof(payload) == 'string' ? payload : '';
            }

            if(contentType == 'favicon'){
                res.setHeader('Content-Type', 'image/x-icon');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            }

            if(contentType == 'plain'){
                res.setHeader('Content-Type', 'text/plain');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            }

            if(contentType == 'css'){
                res.setHeader('Content-Type', 'text/css');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            }

            if(contentType == 'png'){
                res.setHeader('Content-Type', 'image/png');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            }

            if(contentType == 'jpg'){
                res.setHeader('Content-Type', 'image/jpeg');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            }

            // Return the response-parts common to all content-types
            res.writeHead(statusCode);
            res.end(payloadString);

            
            var error = typeof(payload['Error']) != 'undefined' ? JSON.stringify(payload) : '';
            console.log(helpers.getDate().toUTCString() + ' : ' + method.toUpperCase() + ' /' + trimmedPath + ' from ' + req.connection.remoteAddress + ' ' + statusCode.toString() + ' ' + error);
        });
    });
});

// Define the request router
var router = {
    '': handlers.index,
    //@TODO faire des routes intermédiaires
    'account/create': handlers.accountCreate,
    'account/edit': handlers.accountEdit,
    'account/deleted': handlers.accountDeleted,
    'session/create': handlers.sessionCreate,
    'session/deleted': handlers.sessionDeleted,
    'ping': handlers.ping,
    'api/users': handlers.users,
    'api/tokens': handlers.tokens,
    'favicon.ico': handlers.favicon,
    'public': handlers.public
};

// Start the HTTP server
httpServer.listen(config.httpPort,function(){
    console.log('HTTP server is running on port ' + config.httpPort);
});

// Start the HTTPS server
httpsServer.listen(config.httpsPort,function(){
    console.log('HTTPS server is running on port ' + config.httpsPort);
});
