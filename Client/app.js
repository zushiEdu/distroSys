var vendingContent = this.document.getElementById("vendingContent");
var body = this.document.getElementById("body");
const rowAmount = 10;
const colAmount = 5;

var hasLoggedIn = false;

var user = 'ehuber';
var key = 'cd290b3330f20ab30f79d145eae869aecf61f32d2f63d6264e31128334584dfa';

var port = 720;

var loadedProducts = [];

var orderCounter = 0;

// var accountNumber = genRandomAcctNum(381577, updateAccountProperties);
var accountCredit;
getCredit();
var accountNumber = user;

function genRandomAcctNum(seed, _callback) {
    accountNumber = Math.round(Math.random() * seed);
    _callback();
}

function updateAccountProperties() {
    if (hasLoggedIn) {
        this.document.getElementById("accnum").textContent = "Account: " + accountNumber;
        this.document.getElementById("balance").textContent = "Balance: $" + Math.round(accountCredit * 100) / 100;
    } else {
        this.document.getElementById("accnum").textContent = "Please Log In To View Account Details"
        this.document.getElementById("balance").textContent = ""
    }
}

fetch(`http://localhost:${port}/?&user=${user}&key=${key}&operation=load`)
    .then(response => {
        if (response.ok) {
            return response.json()
        }
    })
    .then((products) => {
        loadedProducts = products;
        updateProducts();
    }).catch((error) => {
        var errorText = document.createElement('h3');
        errorText.style = "margin:auto;background-color:white;text-align:center;border-radius:0.5em";
        errorText.textContent = "500, Internal Server Error";
        vendingContent.appendChild(errorText);
        console.log("Could not get products");
        console.log("Error...", error);
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
                var qtyForm = document.createElement("input");
                qtyForm.setAttribute("type", "text");
                qtyForm.setAttribute("id", `${oneDIndex}Form`);
                qtyForm.setAttribute("placeholder", "Quantity");
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
                newCell.appendChild(qtyForm);
                newRow.appendChild(newCell);
            }
            count++;
        }
        if (hasLoggedIn) {
            vendingContent.appendChild(newRow);
        }
    }

    if (!hasLoggedIn) {
        var userName = document.createElement("input");
        var key = document.createElement("input");
        var loginButton = document.createElement("button");

        userName.setAttribute("type", "text");
        userName.setAttribute("id", `usernameForm`);
        userName.setAttribute("placeholder", "Username");

        key.setAttribute("type", "text");
        key.setAttribute("id", `keyForm`);
        key.setAttribute("placeholder", "Key");

        var loginAction = "verifyLogin()";
        button.setAttribute("onClick", loginAction);
        button.appendChild(cellText);
        vendingContent.appendChild(userName);
        vendingContent.appendChild(key);
        vendingContent.appendChild(loginButton);
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
    if (loadedProducts[product].stock - 1 < 0) {
        return;
    }

    var sku = loadedProducts[product].productNumber

    // call for fetching of product

    var qty = document.getElementById(`${product}Form`).value
    if (qty == "") {
        alert("No Quantity Provided");
    } else {
        fetch(`http://localhost:${port}/?&user=${user}&key=${key}&sku=${sku}&order=${orderCounter}&qty=${qty}&operation=request`)
            .then(response => response.json())
            .then(products => {
                requestedProduct = products;
                console.log(requestedProduct);
            });

        orderCounter++;
        getCredit();
        updateAccountProperties();
        clearVendingContent();
        updateProducts();
    }
}

function getCredit() {
    fetch(`http://localhost:${port}/?&user=${user}&key=${key}&operation=userCredit`)
        .then(response => response.json())
        .then(credit => {
            accountCredit = credit.credit;
            updateAccountProperties();
        });
}