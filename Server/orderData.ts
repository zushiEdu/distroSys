import { fileReader } from "./fileReading";
import { order } from './order';

export class orderData {
    fR: fileReader;
    orders: order[];

    constructor(path) {
        this.fR = new fileReader(path);

        this.fR.readDataFromFile((returnedData) => {
            this.orders = returnedData;
        })
    }

    addOrder(order: order) {
        this.orders.push(order);
    }

    getOrder(id: number) {
        if (this.orders != null) {
            for (var i = 0; i < this.orders.length; i++) {
                if (this.orders[i] != null) {
                    console.log(this.orders[i].getId(), id);
                    if (this.orders[i].getId() == id) {
                        return this.orders[i];
                    }
                }
            }
        } else {
            console.error("Product List Not Read.");
            return null;
        }
    }

    getOrders() {
        if (this.orders != null) {
            return this.orders;
        } else {
            console.error("Product List Not Read.");
        }
    }

    readOrders(_callback) {
        this.fR.readDataFromFile((returnedData: order[]) => {
            var tempData: order[] = [];
            if (returnedData == undefined) {
                returnedData = [];
            }
            for (var i = 0; i < returnedData.length; i++) {
                let o: order = returnedData[i];

                var nO = new order(o.id, o.datePosted);
                for(var x = 0; x < o.products.length; x++) {
                    nO.addProduct(o.products[x]);
                }
                tempData.push(nO);
            }
            this.orders = tempData;
            if (_callback != null) {
                _callback;
            }
        });
    }

    writeDataToFile() {
        console.log(this.orders);
        this.fR.writeDataToFile(this.orders, null);
    }
}