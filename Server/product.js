var proudctsList = require("./products.json");

exports.getProduct = function (sku) {
    for (var i = 0; i < proudctsList.length; i++) {
        if (proudctsList[i].productNumber == sku) {
            return proudctsList[i];
        }
    }
}

exports.getProducts = function () {
    return proudctsList;
}