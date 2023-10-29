var vendingContent = this.document.getElementById("vendingContent");
const rowAmount = 10;
const colAmount = 5;

var loadedProducts = [];

var accountCredit = 100;
var accountNumber = genRandomAcctNum(381577, updateAccountProperties);

function genRandomAcctNum(seed, _callback) {
    accountNumber = Math.round(Math.random() * seed);
    _callback();
}

function updateAccountProperties() {
    this.document.getElementById("accnum").textContent = "Account Num: " + accountNumber;
    this.document.getElementById("balance").textContent = "Balance: $" + Math.round(accountCredit * 100) / 100;
}

fetch('products.json')
    .then(response => response.json())
    .then(products => {
        loadedProducts = products;
        updateProducts();
    });

function updateProducts() {
    var count = 0;
    for (var y = 0; y <= rowAmount; y++) {
        if (count < loadedProducts.length) {
            var newRow = document.createElement('tr');
        }
        for (var x = 0; x < colAmount; x++) {
            var oneDIndex = (y * colAmount) + x;
            if (count < loadedProducts.length) {
                var newCell = document.createElement('td');
                var cellText = document.createElement('p');
                cellText.textContent = `Dispense`;
                var button = document.createElement('button');
                var action = "buttonLog(" + oneDIndex + ");";
                if (loadedProducts[oneDIndex] != undefined) {
                    var productDescText = document.createElement('p');
                    var productPriceText = document.createElement('p')
                    var stock = document.createElement('p');
                    productDescText.textContent = loadedProducts[oneDIndex].productDescription;
                    productPriceText.textContent = "$" + loadedProducts[oneDIndex].price;
                    stock.textContent = loadedProducts[oneDIndex].stock + " in stock";
                    newCell.appendChild(productDescText);
                    newCell.appendChild(productPriceText);
                    newCell.appendChild(stock);
                }
                button.setAttribute("onClick", action);
                button.appendChild(cellText);
                newCell.appendChild(button);
                newRow.appendChild(newCell);
            }
            count++;
        }
        vendingContent.appendChild(newRow);
    }
}

function clearVendingContent() {
    while (vendingContent.firstChild) {
        vendingContent.removeChild(vendingContent.firstChild);
    }
}

function buttonLog(product) {
    if (loadedProducts[product] == undefined) {
        return;
    }
    if (accountCredit < loadedProducts[product].price) {
        return;
    }

    console.log(loadedProducts[product]);

    // call for fetching of product


    // charge account
    accountCredit -= loadedProducts[product].price;
    loadedProducts[product].stock -= 1;
    updateAccountProperties();
    clearVendingContent();
    updateProducts();
}