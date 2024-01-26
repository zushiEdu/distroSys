var fileReader = require('./fileReading');
var order = require('./order');

let orders = [];

class orderData {
    constructor(path) {
        this.fR = new fileReader(path);
    }

    addOrder(order) {
        orders.push(order);
    }

    getOrder(id) {
        if (orders != null) {
            for (var i = 0; i < orders.length; i++) {
                if (orders[i] != null) {
                    console.log(orders[i].getId(), id);
                    if (orders[i].getId() == id) {
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
            if (returnedData != "") {
                for (var i = 0; i < returnedData.length; i++) {
                    orders[i] = new order(returnedData[i].id, returnedData[i].datePosted, returnedData[i].products);
                }
            }
        });
    }

    writeDataToFile() {
        console.log(orders);
        this.fR.writeDataToFile(orders, null);
    }
}

module.exports = orderData;