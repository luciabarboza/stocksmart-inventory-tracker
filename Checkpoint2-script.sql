-- Drop tables if they already exist to ensure a clean slate
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS shopping_list;
DROP TABLE IF EXISTS food_item;
DROP TABLE IF EXISTS nutritional_information;
DROP TABLE IF EXISTS expiration_alert;

-- Table creation based on relational schema

-- 1. User Table: Stores user information with unique email
CREATE TABLE user (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100),          -- User's name
    email VARCHAR(100) UNIQUE,   -- Unique email for user login
    password VARCHAR(100)        -- User's password
);

-- 2. Inventory Table: Stores each user's items with quantities, expiration dates, and storage location
CREATE TABLE inventory (
    inventory_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,                       -- References user who owns the inventory item
    item_name VARCHAR(100),                -- Name of the inventory item
    quantity INTEGER,                      -- Quantity of the item
    expiration_date DATE,                  -- Expiration date of the item
    category_name TEXT CHECK (category_name IN ('freezer', 'fridge', 'pantry')),  -- Storage location
    FOREIGN KEY (user_id) REFERENCES user(user_id)  -- Ensures item is linked to a valid user
);

-- 3. Shopping List Table: Stores items that users plan to purchase
CREATE TABLE shopping_list (
    shopping_list_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,               -- References the user who created the shopping list item
    item_name VARCHAR(100),        -- Name of the item to purchase
    quantity INTEGER,              -- Quantity of the item needed
    status TEXT DEFAULT 'Pending', -- Purchase status (e.g., 'Pending', 'Purchased')
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

-- 4. Food Item Table: Stores information about food items, independent of specific users
CREATE TABLE food_item (
    food_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_name VARCHAR(100),        -- Name of the food item
    brand_name VARCHAR(100),       -- Brand of the food item
    category VARCHAR(100),         -- Category of the food (e.g., 'Dairy', 'Bakery')
    quantity INTEGER,              -- Standard quantity of the item
    expiration_date DATE           -- Expiration date (optional, can be NULL if not applicable)
);

-- 5. Nutritional Information Table: Stores nutritional details for food items
CREATE TABLE nutritional_information (
    nutritional_information_id INTEGER PRIMARY KEY AUTOINCREMENT,
    food_item_id INTEGER,                  -- Links to the specific food item
    calories INTEGER,                     -- Calorie count per serving
    fat INTEGER,                          -- Fat content in grams
    carbohydrates INTEGER,                -- Carbohydrate content in grams
    protein INTEGER,                      -- Protein content in grams
    dietary_labels TEXT,                  -- Dietary labels (e.g., 'Organic', 'Gluten-Free')
    FOREIGN KEY (food_item_id) REFERENCES food_item(food_item_id) -- Links nutritional data to a food item
);

-- 6. Expiration Alert Table: Stores expiration alerts for items in users' inventory
CREATE TABLE expiration_alert (
    expiration_alert_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,                      -- References the user to whom the alert belongs
    item_name VARCHAR(100),               -- Name of the expiring item
    expiration_date DATE,                 -- Expiration date of the item
    inventory_id INTEGER,                 -- References inventory item if applicable
    status TEXT DEFAULT 'Pending',        -- Alert status (e.g., 'Pending', 'Resolved')
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (inventory_id) REFERENCES inventory(inventory_id)
);

-- Sample Data Insertions

-- Inserting data into the User Table
INSERT INTO user (name, email, password) VALUES 
('Ken Suson', 'ksuson@gmail.com', 'password123'),
('Richmond Stockton', 'broke@gmail.com', 'password123'),
('Jenny', 'fromtheblock@gmail.com', 'password123'),
('Stell Ajero', 'stellajero@gmail.com', 'password123'),
('Jake Perry', 'jakeperry@gmail.com', 'securepass'),
('Lisa Turner', 'lisaturner@gmail.com', 'lisa123');

-- Inserting data into the Inventory Table with category_name options
INSERT INTO inventory (user_id, item_name, quantity, expiration_date, category_name) VALUES
(1, 'Milk', 2, '2024-12-31', 'fridge'),
(1, 'Apples', 3, '2024-12-20', 'fridge'),
(2, 'Chicken', 1, '2024-12-15', 'freezer'),
(3, 'Bread', 2, '2024-11-30', 'pantry'),
(3, 'Bananas', 6, '2024-12-01', 'fridge'),
(4, 'Orange Juice', 1, '2024-11-20', 'fridge'),
(5, 'Eggs', 12, '2024-12-10', 'fridge');

-- Inserting data into the Food Item Table
INSERT INTO food_item (item_name, brand_name, category, quantity, expiration_date) VALUES
('Milk', 'Brand A', 'Dairy', 2, '2024-12-31'),
('Eggs', 'Brand B', 'Dairy', 12, '2024-12-31'),
('Bread', 'Brand C', 'Bakery', 1, '2024-12-31'),
('Butter', 'Brand D', 'Dairy', 1, '2024-12-31'),
('Apples', 'Brand E', 'Fruit', 5, '2024-12-31'),
('Bananas', 'Brand F', 'Fruit', 6, '2024-12-31'),
('Chicken', 'Brand G', 'Meat', 2, '2024-12-31'),
('Orange Juice', 'Brand H', 'Beverage', 1, '2024-12-31'),
('Cheese', 'Brand I', 'Dairy', 2, '2024-12-31'),
('Rice', 'Brand J', 'Pantry', 10, '2025-06-30');

-- Inserting data into the Nutritional Information Table
-- Note: Ensure food_item_id corresponds to valid food_item entries
INSERT INTO nutritional_information (food_item_id, calories, protein, fat, carbohydrates, dietary_labels) VALUES
(1, 200, 10, 5, 30, 'Gluten-Free'),
(2, 150, 8, 3, 20, 'Organic'),
(3, 250, 5, 1, 50, 'Vegan'),
(4, 100, 0, 7, 0, 'Dairy-Free'),
(5, 95, 0, 0, 25, 'Fresh');

-- Inserting data into the Shopping List Table
INSERT INTO shopping_list (user_id, item_name, quantity, status) VALUES
(1, 'Rice', 5, 'Pending'),
(2, 'Cheese', 1, 'Pending'),
(3, 'Milk', 2, 'Purchased'),
(4, 'Bread', 3, 'Pending'),
(5, 'Butter', 1, 'Purchased'),
(6, 'Apples', 4, 'Pending');

-- Inserting data into the Expiration Alert Table
-- These are items that will be expiring soon for alert purposes
INSERT INTO expiration_alert (user_id, item_name, expiration_date, inventory_id, status) VALUES
(1, 'Milk', '2024-12-30', 1, 'Pending'),
(2, 'Apples', '2024-12-20', 2, 'Pending'),
(3, 'Bread', '2024-11-29', 3, 'Resolved'),
(4, 'Orange Juice', '2024-11-19', 4, 'Pending');

-- Sample Queries and Modifications

-- Retrieve all dairy items in the food_item table
SELECT * FROM food_item WHERE category = 'Dairy';

-- Update the status of a purchased item in the shopping list
UPDATE shopping_list SET status = 'Purchased' WHERE shopping_list_id = 1;

-- Delete a user by email
DELETE FROM user WHERE email = 'fromtheblock@gmail.com';

-- Retrieve nutritional information for a specific food item labeled 'Organic'
SELECT * FROM nutritional_information WHERE dietary_labels LIKE '%Organic%';

-- Insert a new item into the inventory for user_id 2
INSERT INTO inventory (user_id, item_name, quantity, expiration_date, category_name) VALUES (2, 'Yogurt', 3, '2024-11-25', 'fridge');

-- Insert a new pending item into the shopping list for user_id 3
INSERT INTO shopping_list (user_id, item_name, quantity) VALUES (3, 'Bananas', 4);

-- Display items that are expiring within the next 30 days
SELECT * FROM expiration_alert WHERE expiration_date < '2024-12-31';

-- Count the total number of items per category in the food_item table
SELECT category, COUNT(*) AS total_items FROM food_item GROUP BY category;
