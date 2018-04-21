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
            var quan = data[i].stock_quantity;
            strOut = '';
            strOut += 'Item ID: ' + data[i].item_id + ' ';
            strOut += 'Product Name: ' + data[i].product_name + ' // ';
            strOut += 'Department: ' + data[i].department_name + ' // ';
            strOut += 'Price: $' + data[i].price + ' // ';
            strOut += 'Quantity: ' + quan;
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
        switch (selection) {
            case 'View items for sale':
                displayInventory();
                start();
                break;
            case 'View Low Inventory':
                viewLowInv();
                start();
                break;
            case 'Add to Inventory':
                displayInventory();
                addToInv();

                break;
            case 'Add New Product':
                addProduct();
                break;
        };
    });
};

viewLowInv = () => {
    queryStr = 'SELECT * FROM products';
    connection.query(queryStr, function(err, data) {
        if (err) throw err;
        console.log("Low Inventory: ");
        var strOut = '';
        for (var i = 0; i < data.length; i++) {
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
    console.log("< ADD TO INVENTORY >")
        // var item = input.item_id;
        // var quantity = input.quantity;
        // console.log("you selected: " + item + " , quantity: " + quantity);
    var queryStr = 'SELECT * FROM products WHERE ?';
    connection.query('SELECT * FROM products', function(err, data) {
        if (err) throw err;
        inquirer.prompt([{
                type: 'number',
                name: 'item_id',
                message: 'Please enter the item ID number you would like to modify',

            },
            {
                type: 'number',
                name: 'quantity',
                message: 'How many?',

            }
        ]).then(function(input) {

            if (data.length === 0) {
                console.log('ERROR: INVALID ITEM ID, SELECT A VALID ITEM ID');
                addToInv();
            } else {
                var newQuan = parseInt(data[input.item_id - 1].stock_quantity) + parseInt(input.quantity);
                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: newQuan
                }, {
                    item_id: input.item_id
                }], function(err, data) {
                    if (err) throw err;
                    console.log("item quantity updated!");
                    console.log('\n');
                    start();
                })
            }
        })
    });
}
addProduct = () => {
    inquirer.prompt([{
            type: "input",
            message: "What is the product name?",
            name: "itemName"
        },
        {
            type: "input",
            message: "What is the department?",
            name: "itemDept"
        },
        {
            type: "input",
            message: "What is the price?",
            name: "itemPrice"
        },
        {
            type: "input",
            message: "How many do we have?",
            name: "itemQuan"
        },
    ]).then(function(user) {
        var name = user.itemName;
        var dept = user.itemDept;
        var money = user.itemPrice;
        var stock = user.itemQuan;

        // console.log(name + ", " + dept + ", " + money + ", " + stock + " ");

        connection.query(
            "INSERT INTO products SET ?", {
                product_name: name,
                department_name: dept,
                price: money,
                stock_quantity: stock
            },
            function(err, res) {
                console.log("product has been added to inventory");
                console.log("\n");
                start();
            }
        )

    })
};