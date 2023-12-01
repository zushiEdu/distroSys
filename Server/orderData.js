var fileReader = require('./fileReading');
var order = require('./order');

var orders;

class orderData {
    constructor(path) {
        this.fR = new fileReader(path);

        this.fR.readDataFromFile(function (returnedData) {
            orders = returnedData;
        })
    }

    addOrder(order) {
        orders.push(order);
    }

    getOrder(id) {
        if (orders != null) {
            for (var i = 0; i < orders.length; i++) {
                if (orders[0][i] != null) {
                    console.log(orders[0][i].getId(), id);
                    if (orders[0][i].getId() == id) {
                        return orders[i];
                    }
                }
            }
        } else {
            console.error("Product List Not Read.");
            return null;
        }
    }

    getOrders() {
        if (orders != null) {
            return orders;
        } else {
            console.error("Product List Not Read.");
        }
    }

    readOrders(_callback) {
        this.fR.readDataFromFile(function (returnedData) {
            var tempData = [];
            if (returnedData == undefined) {
                returnedData = [];
            }
            for (var i = 0; i < returnedData.length; i++) {
                var o = returnedData[i];

                var nO = new order(o.id, o.datePosted);
                nO.addProduct(o.products);
                tempData.push(nO);
            }
            orders = tempData;
            if (_callback != null) {
                _callback;
            }
        });
    }

    writeDataToFile() {
        console.log(orders);
        this.fR.writeDataToFile(orders, null);
    }
}

module.exports = orderData;