// libraries
const http = require('http');
const url = require('url');
const crypto = require('crypto');
const fs = require('fs');
const productData = require('./productData');
const orderData = require('./orderData');
const order = require('./order');
const product = require('./product');
const task = require('./task');
const reader = require('./fileReading');

// modules
let pD = new productData('./Data/products.json');
let stackData = new reader('./Data/stack.json');
let oD = new orderData('./Data/orders.json');

// orderData.writeDataToFile(new order(1, [new product("1", 1, 1, 1, true, 1), new product("2", 2, 2, 2, true, 2)]));

// let tempData = new reader('./Data/products.json');
// tempData.writeDataToFile([new product("I1", 1, 1, 1, true, 1), new product("I2", 1, 1, 2, true)], null);


// data
var config = require("./Data/config.json");

// log config
console.log("Config:", config);
console.log("\n");

// stack of robot tasks
var stack = [];

var orderCounter = 0;

try {
    // create server for webApp on port based on config file designation
    http.createServer(function (request, response) {
        pD.readProducts();
        oD.readOrders();

        // set content type
        response.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500')
        response.writeHead(200, { 'Content-Type': 'application/json' });
        if (request.url === '/favicon.ico') {
            // ignore favicon requests
        } else {
            stackData.readDataFromFile(function (data) {
                stack = data;
                // console.log(stack);
            });

            // query url for params
            var query = url.parse(request.url, true).query;
            console.log("URL Query:", query);
            // change modes based on operation provided
            if (query.operation == "request" || query.operation == "load" || query.operation == "userCredit") {
                fs.readFile('./Data/users.json', 'utf8', function (err, users) {
                    users = JSON.parse(users);
                    // verify user based on username and key
                    if (verifyUser(users, query.user, query.key)) {
                        if (query.operation == "load") {
                            var loadedProducts = pD.getProducts();
                            response.write(JSON.stringify(loadedProducts, null, 4));
                            console.log("Returned Catalog with", loadedProducts.length, "products in it.");
                        } else if (query.operation == "userCredit") {
                            response.write(JSON.stringify({ "credit": getCredit(users, query.user) }, null, 4));
                            console.log("Returned Account Credit");
                        } else {
                            var returnedProduct = pD.getProduct(query.sku);
                            // look for sku in database, return object if sku is matching
                            if (returnedProduct != undefined) {
                                // post product request
                                var newTask = new task(query.sku, stack.counter);

                                console.log("Returned Product", returnedProduct);

                                // console.log("Order:", query.order);
                                if (query.order != null && query.order != undefined) {
                                    if (!checkForOrder(query.order)) {
                                        // order does not exist, create new order
                                        var newOrder = new order(query.order);
                                        newOrder.post();
                                        newOrder.addProduct(newTask);

                                        oD.addOrder(newOrder);

                                        orderCounter++;
                                        console.log("New Order Created");
                                    } else {
                                        console.log(oD.getOrder(Number(query.order)));
                                        console.log(returnedProduct);
                                        // order does exist, add product to order
                                        oD.getOrder(Number(query.order)).addProduct(newTask);
                                    }
                                } else {
                                    response.write(JSON.stringify({ error: '400 Order Not Given' }));
                                    console.log("Error 400: Order Not Given")
                                }

                                oD.writeDataToFile();
                                pD.getProduct(query.sku).stock--;
                                pD.writeDataToFile();

                                console.log(users[matchUser(users, query.user)]);
                                users[matchUser(users, query.user)].credit -= returnedProduct.price;
                                fs.writeFile("./Data/users.json", JSON.stringify(users), 'utf8', (e) => {
                                    console.log(e);
                                });

                                console.log(returnedProduct.getProductNumber);
                                console.log("Returned product ID:", returnedProduct.getProductNumber());
                                console.log("Operation:", query.operation, "product, dispatching bot.");
                                // send signal to dispatch bot here by adding task to stack
                                stack.stack.push(newTask);
                                // console.log("Stack", stack);
                                stack.counter++;
                                stackData.writeDataToFile(stack, null);
                                response.write(JSON.stringify(returnedProduct, null, 4));
                            } else {
                                // send back 400 code and log error if sku is not found
                                response.statusCode = 400;
                                response.write(JSON.stringify({ error: '400 Sku not found' }));
                                console.log("Error 400: Sku not found");
                            }
                        }
                    } else {
                        // send back 401 code and log error if user is not authenticated
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
                        // send back 403 code and log error if a user with same username is already signed up for key
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

// get credit for user
function getCredit(users, username) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].user == username) {
            return users[i].credit;
        }
    }
}

// get user index of username
function matchUser(users, username) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].user == username) {
            return i;
        }
    }
}

function checkForOrder(number) {
    if (oD.getOrder(number) == null) {
        return false;
    }
    return true;
}