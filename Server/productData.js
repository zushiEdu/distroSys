var fileReader = require('./fileReading');
var product = require('./product');

var productsList;

class productData {
    constructor(path) {
        this.fR = new fileReader(path);

        this.fR.readDataFromFile(function (returnedData) {
            productsList = returnedData;
        })
    }

    getProduct(sku) {
        if (productsList != null) {
            for (var i = 0; i < productsList.length; i++) {
                if (productsList[i].productNumber == sku) {
                    return productsList[i];
                }
            }
        } else {
            console.error("Product List Not Read.");
            return null;
        }
    }

    getProducts() {
        if (productsList != null) {
            return productsList;
        } else {
            console.error("Product List Not Read.");
        }
    }

    readProducts(_callback) {
        this.fR.readDataFromFile(function (returnedData) {
            var tempData = [];
            for (var i = 0; i < returnedData.length; i++) {
                var p = returnedData[i];
                tempData.push(new product(p.productDescription, p.stock, p.price, p.productNumber, p.display, p.lpn));
            }
            productsList = tempData;
            _callback;
        });
    }
}

module.exports = productData;