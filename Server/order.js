class order {
    constructor(id) {
        this.id = id;
        this.datePosted = null;
        this.products = null;
    }

    fulfill() {
        this.dateFulfilled = Date.now();
        return this.dateFulfilled;
    }

    post() {
        this.datePosted = Date.now();
    }

    addProduct(product) {
        if (this.products == null || this.products == undefined) {
            this.products = [];
        }
        console.log("Added Product", this.products)
        this.products.push(product);
    }

    getProducts() {
        return this.products;
    }

    getDatePosted() {
        return this.datePosted;
    }

    getDateFulfilled() {
        return this.dateFulfilled;
    }

    getId() {
        return this.id;
    }
}

module.exports = order;