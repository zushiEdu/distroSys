// libraries
var http = require('http');
var url = require('url');
var crypto = require('crypto');
var fs = require('fs');

// modules
var product = require('./productData')

// data
var config = require("./Data/config.json");

// log config
console.log("Config:", config);

// stack of robot tasks
var stack = [];

try {
    // create server for webApp on port based on config file designation
    http.createServer(function (request, response) {
        // set content type
        response.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500')
        response.writeHead(200, { 'Content-Type': 'application/json' });
        if (request.url === '/favicon.ico') {
            // ignore favicon requests
        } else {
            readDataFromFile('./stack.json', function (data) {
                stack = JSON.parse(data);
            });
            console.log(stack);

            // query url for params
            var query = url.parse(request.url, true).query;
            console.log("URL Query:", query);
            // change modes based on operation provided
            if (query.operation == "takeTask" || query.operation == "finishedTask") {
                fs.readFile('./users.json', 'utf8', function (err, users) {
                    users = JSON.parse(users);
                    // verify user based on username and key
                    if (verifyUser(users, query.user, query.key)) {
                        if (query.operation == "takeTask") {
                            // take most recent task off of stack
                        } else if (query.operation == "finishedTask") {
                            // mark order number as fulfilled
                        }
                    } else {
                        // send back 401 code and log error if user is not authenticated
                        response.write(JSON.stringify({ error: '401 User not verified.' }));
                        console.log("Error 401 User not verified.");
                    }
                    response.end();
                });

            } else {
                response.write(JSON.stringify({ error: '406 invalid query.' }));
                console.log("Error 406 invalid query.");
            }
        }
        console.log("--------------------");
    }).listen(config.robotAccessPort);
} catch (e) {
    console.log("Error", e);
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

function readDataFromFile(path, _callback) {
    fs.readFile(path, 'utf8', function (err, returnedData) {
        _callback(returnedData);
    });
}

function writeDataToFile(path, data, _callback) {
    fs.writeFile(path, data, 'utf8', function (err, data) { });
    _callback;
}