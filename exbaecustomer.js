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
        for (var i = 0; i < data.length; i++) {
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

    displayInventory();
    inquirer.prompt([{
            type: 'input',
            name: 'item_id',
            message: 'Please enter the item ID number you would like to purchase',

        },
        {
            type: 'input',
            name: 'quantity',
            message: 'how many would you like?',

        }
    ]).then(function(input) {
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
};