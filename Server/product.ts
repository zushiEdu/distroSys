export class product {
    productDescription: string;
    stock: number;
    price: number;
    productNumber: number;
    display: boolean;

    constructor(productDescription, stock, price, productNumber, display) {
        this.productDescription = productDescription;
        this.stock = stock;
        this.price = price;
        this.productNumber = productNumber;
        this.display = display;
    }

    getProductDescription() {
        return this.productDescription;
    }

    setProductDescription(description) {
        this.productDescription = description;
    }

    getStock() {
        return this.stock;
    }

    setStock(amount) {
        this.stock = amount;
    }

    getPrice() {
        return this.price;
    }

    setPrice(price) {
        this.price = price;
    }

    getDisplay() {
        return this.display;
    }

    setDisplay(display) {
        this.display = display;
    }

    getProductNumber() {
        return this.productNumber;
    }
}