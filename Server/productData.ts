import { fileReader } from './fileReading';
import { product } from './product';

export class productData {
    fR: fileReader;
    productsList: product[];

    constructor(path) {
        this.fR = new fileReader(path);

        this.fR.readDataFromFile((returnedData) => {
            this.productsList = returnedData;
        })
    }

    getProduct(sku) {
        if (this.productsList != null) {
            for (var i = 0; i < this.productsList.length; i++) {
                if (this.productsList[i].productNumber == sku) {
                    return this.productsList[i];
                }
            }
        } else {
            console.error("Product List Not Read.");
            return null;
        }
    }

    getProducts() {
        if (this.productsList != null) {
            return this.productsList;
        } else {
            console.error("Product List Not Read.");
        }
    }

    readProducts(_callback) {
        this.fR.readDataFromFile((returnedData) => {
            var tempData = [];
            for (var i = 0; i < returnedData.length; i++) {
                var p = returnedData[i];
                tempData.push(new product(p.productDescription, p.stock, p.price, p.productNumber, p.display));
            }
            this.productsList = tempData;
            _callback;
        });
    }
}