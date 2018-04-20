var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "exbae_db"
});

connection.connect(function(err) {
    if (err) throw err;
    start();
});

displayInventory = () => {
    queryStr = 'SELECT * FROM products';
    connection.query(queryStr, function(err, data) {
        if (err) throw err;
        console.log("Current Inventory: ");
        var strOut = '';
        for (var i = 1; i < data.length; i++) {
            strOut = '';
            strOut += 'Item ID: ' + data[i].item_id + ' ';
            strOut += 'Product Name: ' + data[i].product_name + ' // ';
            strOut += 'Department: ' + data[i].department_name + ' // ';
            strOut += 'Price: $' + data[i].price;
            console.log(strOut);
        }
    })
}

start = () => {
    inquirer.prompt([{
        type: 'list',
        name: 'menu',
        message: 'Please Select from the following options: ',
        choices: ['View items for sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']

    }]).then(function(input) {

        var selection = input.menu;
        console.log(selection);
        if (selection === 'View items for sale') {
            displayInventory();
            start();
        } else if (selection === 'View Low Inventory') {
            viewLowInv();
            start();
        } else if (selection === 'Add to Inventory') {
            addToInv();
            start();
        } else if (selection === 'Add New Product') {
            addProduct();
            start();
        };
    });
};

viewLowInv = () => {
    queryStr = 'SELECT * FROM products';
    connection.query(queryStr, function(err, data) {
        if (err) throw err;
        console.log("Low Inventory: ");
        var strOut = '';
        for (var i = 1; i < data.length; i++) {
            var quan = data[i].stock_quantity;
            strOut = '';
            strOut += 'Item ID: ' + data[i].item_id + ' ';
            strOut += 'Product Name: ' + data[i].product_name + ' // ';
            strOut += 'Department: ' + data[i].department_name + ' // ';
            strOut += 'Quantity: ' + quan;
            if (quan <= 5) {
                console.log(strOut);
            }
        }
    })
}
addToInv = () => {
    inquirer.prompt([{
            type: 'input',
            name: 'item_id',
            message: 'Please enter the item ID number you would like to modify',

        },
        {
            type: 'input',
            name: 'quantity',
            message: 'how many would you like to add?',

        }
    ]).then(function(input) {
        // based on their answer, either call the bid or the post functions
        var item = input.item_id;
        var quantity = input.quantity;
        console.log("you selected: " + item + " , quantity: " + quantity);

        var queryStr = 'SELECT * FROM products WHERE ?';
        connection.query(queryStr, { item_id: item }, function(err, data) {
            if (err) throw err;

            if (data.length === 0) {
                console.log('ERROR: INVALID ITEM ID, SELECT A VALID ITEM ID');
                displayInventory();
            } else {
                var productInfo = data[0];

                if (quantity <= productInfo.stock_quantity) {
                    console.log("Item is in stock!");
                    var update = 'UPDATE products SET stock_quantity = ' + (productInfo.stock_quantity - quantity) + ' WHERE item_id = ' + item;
                    connection.query(update, function(err, data) {
                        if (err) throw err;

                        console.log("Your order has been placed!");
                        console.log("Your total is: $" + productInfo.price * quantity);

                        connection.end()
                    })
                } else {
                    console.log("The item is out of stock, please try again" + '\n');
                    start();
                }
            }
        })
    });
}
addProduct = () => {}