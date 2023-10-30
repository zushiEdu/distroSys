// libraries
var http = require('http');
var url = require('url');
var crypto = require('crypto');
var fs = require('fs');

// modules
var product = require('./product')

// data
var config = require("./config.json");

// log config
console.log("Config:", config);

try {
    // create server for webApp on port based on config file designation
    http.createServer(function (request, response) {
        // set content type
        response.writeHead(200, { 'Content-Type': 'application/json' });
        if (request.url === '/favicon.ico') {
            // ignore favicon requests
        } else {
            // query url for params
            var query = url.parse(request.url, true).query;
            console.log("URL Query:", query);
            // change modes based on operation provided
            if (query.operation == "get" || query.operation == "return") {
                fs.readFile('./users.json', 'utf8', function (err, users) {
                    users = JSON.parse(users);
                    // verify user based on username and key
                    if (verifyUser(users, query.user, query.key)) {
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
                    } else {
                        // send back 4-- code and log error if user is not authenticated
                        response.write(JSON.stringify({ error: '401 User not verified.' }));
                        console.log("Error 401 User not verified.");
                    }
                    response.end();
                });
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
                        // send back 4-- code and log error if a user with same username is already signed up for key
                        response.write(JSON.stringify({ error: '403 user already exists.' }));
                        console.log("Error 403 user already exists.");
                    }

                });
            } else {
                response.write(JSON.stringify({ error: '406 invalid query.' }));
                console.log("Error 406 invalid query.");
            }
        }
        console.log("--------------------");
    }).listen(config.webAppAccessPort);
} catch (e) {
    console.log("Error", e);
}

// check for matching username
function checkForUser(users, username) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].user == username) {
            return true;
        }
    }
    return false;
}

// check for matching username and key
function verifyUser(users, username, key) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].user == username) {
            if (users[i].key == key) {
                return true;
            }
        }
    }
    return false;
}