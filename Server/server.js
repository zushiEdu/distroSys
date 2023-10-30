// libraries
var http = require('http');
var url = require('url');
var crypto = require('crypto');
var fs = require('fs');

// modules
var product = require('./product')

// data
var config = require("./config.json");
// var users = require('./users.json');

console.log("Config:", config);

try {
    // create server object on port 720
    http.createServer(function (request, response) {
        // set content type
        response.writeHead(200, { 'Content-Type': 'application/json' });
        if (request.url === '/favicon.ico') {

        } else {
            // query url for params
            var query = url.parse(request.url, true).query;
            console.log("URL Query:", query);
            if (query.operation == "get" || query.operation == "return") {
                var returnedProduct = product.getProduct(query.sku);
                // look for sku in database, return object if sku is matching
                if (returnedProduct != undefined) {
                    response.write(JSON.stringify(returnedProduct, null, 4));
                    console.log("Returned product:", returnedProduct.productNumber);
                    console.log("Operation:", query.operation, "product, dispatching bot.");
                    // send signal to dispatch bot here
                } else {
                    // send back 400 code and log error if sku is not found
                    response.statusCode = 400;
                    response.write(JSON.stringify({ error: '400 Sku not found' }));
                    console.log("Error 400: Sku not found");
                }
            } else if (query.operation == "signup") {
                fs.readFile('./users.json', 'utf8', function (err, users) {
                    users = JSON.parse(users);
                    // sign user up for new api key
                    if (!checkForUser(users, query.user)) {
                        var key = crypto.randomBytes(32).toString('hex')
                        users.push({ user: query.user, key: key });
                        var json = JSON.stringify(users);
                        // store user with corresponding key
                        fs.writeFile('./users.json', json, 'utf8', function (err, data) { });
                        console.log("User", query.user, "signed up for new key.");
                        response.write(JSON.stringify({ key: `${key}` }));
                    } else {
                        response.write(JSON.stringify({ error: '4-- user already exists.' }));
                        console.log("Error 4-- user already exists.");
                    }
                });
            }
        }
        response.end();
    }).listen(config.webAppAccessPort);
} catch (e) {
    console.log("Error", e);
}

function checkForUser(users, username) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].user == username) {
            return true;
        }
    }
    return false;
}