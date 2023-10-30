var http = require('http');
var url = require('url');
var product = require('./product')
var config = require("./config.json");

console.log("Config:", config);

// create server object on port 720
http.createServer(function (request, response) {
    // set content type
    response.writeHead(200, { 'Content-Type': 'application/json' });
    if (request.url === '/favicon.ico') {

    } else {
        // query url for params
        var query = url.parse(request.url, true).query;
        console.log("URL Query:", query);
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
    }
    response.end();
}).listen(config.webAppAccessPort);