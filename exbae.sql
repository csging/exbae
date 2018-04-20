DROP DATABASE IF EXISTS exbae_db;
CREATE DATABASE exbae_db;

USE exbae_db;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price decimal(7,2) default 0.01,
  stock_quantity int(10),
  PRIMARY KEY (item_id)
);

insert into products (product_name, department_name, price, stock_quantity)
VALUES ("Box of Mens Clothing", "clothing", 100, 5);
insert into products (product_name, department_name, price, stock_quantity)
VALUES ("XboxOne", "video games", 75, 3);
insert into products (product_name, department_name, price, stock_quantity)
VALUES ("The Toaster", "kitchen", 10, 4);
insert into products (product_name, department_name, price, stock_quantity)
VALUES ("Your Crazy Ex's Engagement Ring", "jewelery", 1000, 10);
insert into products (product_name, department_name, price, stock_quantity)
VALUES ("All of The Power Tools", "tools", 500, 6);
insert into products (product_name, department_name, price, stock_quantity)
VALUES ("Bike", "sports", 100, 8);
insert into products (product_name, department_name, price, stock_quantity)
VALUES ("The Couch", "furniture", 50, 1);
insert into products (product_name, department_name, price, stock_quantity)
VALUES ("Busted car", "automotive", 500, 9);
insert into products (product_name, department_name, price, stock_quantity)
VALUES ("TV", "electronics", 300, 8 );
insert into products (product_name, department_name, price, stock_quantity)
VALUES ("Box of Video Games", "video games", 100, 3);


