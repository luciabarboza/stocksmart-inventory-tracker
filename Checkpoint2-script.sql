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
    food_item_id INTEGER,                  -- References a specific food item
    quantity INTEGER,                      -- Quantity of the item
    expiration_date DATE,                  -- Expiration date of the item
    category_name TEXT CHECK (category_name IN ('freezer', 'fridge', 'pantry')),  -- Storage location
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (food_item_id) REFERENCES food_item(food_item_id)  -- Links to a valid food item
);

-- 3. Shopping List Table: Stores items that users plan to purchase
CREATE TABLE shopping_list (
    shopping_list_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,               -- References the user who created the shopping list item
    food_item_id INTEGER,          -- References a specific food item
    quantity INTEGER,              -- Quantity of the item needed
    status TEXT DEFAULT 'Pending', -- Purchase status (e.g., 'Pending', 'Purchased')
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (food_item_id) REFERENCES food_item(food_item_id)
);

-- 4. Food Item Table: Stores information about food items, independent of specific users
CREATE TABLE food_item (
    food_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_name VARCHAR(100) UNIQUE, -- Name of the food item (unique to avoid duplicates)
    brand_name VARCHAR(100),       -- Brand of the food item
    category VARCHAR(100),         -- Category of the food (e.g., 'Dairy', 'Bakery')
    quantity INTEGER,              -- Standard quantity of the item
    quantity_unit VARCHAR(50),     -- Unit of measurement for quantity (e.g., 'pcs', 'kg')
    expiration_date DATE           -- Expiration date (optional, can be NULL if not applicable)
);

-- 5. Nutritional Information Table: Stores nutritional details for food items
CREATE TABLE nutritional_information (
    nutritional_information_id INTEGER PRIMARY KEY AUTOINCREMENT,
    food_item_id INTEGER,                  -- Links to the specific food item
    calories INTEGER DEFAULT 0,            -- Calorie count per serving
    fat INTEGER DEFAULT 0,                 -- Fat content in grams
    carbohydrates INTEGER DEFAULT 0,       -- Carbohydrate content in grams
    protein INTEGER DEFAULT 0,             -- Protein content in grams
    dietary_labels TEXT,                   -- Dietary labels (e.g., 'Organic', 'Gluten-Free')
    FOREIGN KEY (food_item_id) REFERENCES food_item(food_item_id)
);

-- 6. Expiration Alert Table: Stores expiration alerts for items in users' inventory
CREATE TABLE expiration_alert (
    expiration_alert_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,                      -- References the user to whom the alert belongs
    inventory_id INTEGER,                 -- References inventory item if applicable
    expiration_date DATE,                 -- Expiration date of the item
    status TEXT DEFAULT 'Pending',        -- Alert status (e.g., 'Pending', 'Resolved')
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (inventory_id) REFERENCES inventory(inventory_id)
);

-- SAMPLE DATA INSERTIONS

-- Inserting data into the User Table
INSERT INTO user (name, email, password) VALUES 
('Ken Suson', 'ksuson@gmail.com', 'password123'),
('Richmond Stockton', 'broke@gmail.com', 'password123'),
('Jenny', 'fromtheblock@gmail.com', 'password123'),
('Stell Ajero', 'stellajero@gmail.com', 'password123'),
('Jake Perry', 'jakeperry@gmail.com', 'securepass'),
('Lisa Turner', 'lisaturner@gmail.com', 'lisa123');

-- Inserting data into the Food Item Table with unique names
INSERT INTO food_item (item_name, brand_name, category, quantity, quantity_unit, expiration_date) VALUES
('Milk', 'Brand A', 'Dairy', 2, 'liters', '2024-12-31'),
('Eggs', 'Brand B', 'Dairy', 12, 'pcs', '2024-12-31'),
('Bread', 'Brand C', 'Bakery', 1, 'loaf', '2024-12-31'),
('Butter', 'Brand D', 'Dairy', 1, 'stick', '2024-12-31'),
('Apples', 'Brand E', 'Fruit', 5, 'pcs', '2024-12-31'),
('Bananas', 'Brand F', 'Fruit', 6, 'pcs', '2024-12-31'),
('Chicken', 'Brand G', 'Meat', 2, 'kg', '2024-12-31'),
('Orange Juice', 'Brand H', 'Beverage', 1, 'liter', '2024-12-31'),
('Cheese', 'Brand I', 'Dairy', 2, 'slices', '2024-12-31'),
('Rice', 'Brand J', 'Pantry', 10, 'kg', '2025-06-30');

-- Inserting data into the Inventory Table with food_item_id references
INSERT INTO inventory (user_id, food_item_id, quantity, expiration_date, category_name) VALUES
(1, 1, 2, '2024-12-31', 'fridge'),
(1, 5, 3, '2024-12-20', 'fridge'),
(2, 7, 1, '2024-12-15', 'freezer'),
(3, 3, 2, '2024-11-30', 'pantry'),
(3, 6, 6, '2024-12-01', 'fridge'),
(4, 8, 1, '2024-11-20', 'fridge'),
(5, 2, 12, '2024-12-10', 'fridge');

-- Inserting data into the Nutritional Information Table
INSERT INTO nutritional_information (food_item_id, calories, protein, fat, carbohydrates, dietary_labels) VALUES
(1, 200, 10, 5, 30, 'Gluten-Free'),
(2, 150, 8, 3, 20, 'Organic'),
(3, 250, 5, 1, 50, 'Vegan'),
(4, 100, 0, 7, 0, 'Dairy-Free'),
(5, 95, 0, 0, 25, 'Fresh');

-- Inserting data into the Shopping List Table
INSERT INTO shopping_list (user_id, food_item_id, quantity, status) VALUES
(1, 10, 5, 'Pending'),
(2, 9, 1, 'Pending'),
(3, 1, 2, 'Purchased'),
(4, 3, 3, 'Pending'),
(5, 4, 1, 'Purchased'),
(6, 5, 4, 'Pending');

-- Inserting data into the Expiration Alert Table with inventory_id references
INSERT INTO expiration_alert (user_id, inventory_id, expiration_date, status) VALUES
(1, 1, '2024-12-30', 'Pending'),
(2, 2, '2024-12-20', 'Pending'),
(3, 3, '2024-11-29', 'Resolved'),
(4, 4, '2024-11-19', 'Pending');
