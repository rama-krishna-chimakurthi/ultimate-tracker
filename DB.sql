-- 1. create DB
sqlite3 mySQLiteDB.db

-- 2. create tables
CREATE TABLE IF NOT EXISTS finance_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  isDeleted BOOLEAN default false,
  type TEXT NOT NULL CHECK (type IN ('Expense', 'Income'))
);

CREATE TABLE IF NOT EXISTS finance_asset_group (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  isDeleted BOOLEAN default false
);

INSERT INTO finance_asset_group (name) VALUES ('Cash');
INSERT INTO finance_asset_group (name) VALUES ('Accounts');
INSERT INTO finance_asset_group (name) VALUES ('Card');
INSERT INTO finance_asset_group (name) VALUES ('Debit Card');
INSERT INTO finance_asset_group (name) VALUES ('Savings');
INSERT INTO finance_asset_group (name) VALUES ('Top-Up/Prepaid');
INSERT INTO finance_asset_group (name) VALUES ('Investments');
INSERT INTO finance_asset_group (name) VALUES ('Overdrafts');
INSERT INTO finance_asset_group (name) VALUES ('Loan');
INSERT INTO finance_asset_group (name) VALUES ('Insurance');
INSERT INTO finance_asset_group (name) VALUES ('Others');


CREATE TABLE finance_asset (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  asset_group_id INTEGER,
  isDeleted BOOLEAN default false,
  settlement_day INTEGER default null,
  FOREIGN KEY (asset_group_id) REFERENCES finance_asset_group (id)
);


ALTER TABLE finance_asset
ADD payment_day INTEGER default null;

INSERT INTO finance_asset (name, asset_group_id) VALUES ('Cash',1);



CREATE TABLE IF NOT EXISTS finance_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER,
  from_asset INTEGER,
  to_asset INTEGER,
  amount REAL NOT NULL,
  date INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('Expense', 'Income', 'Difference', 'Transfer')),
  FOREIGN KEY (category_id) REFERENCES finance_categories (id),
  FOREIGN KEY (from_asset) REFERENCES finance_asset (id),
  FOREIGN KEY (to_asset) REFERENCES finance_asset (id)
 );



-- 3. insert data
INSERT INTO finance_categories (name, type) VALUES ('Utilities', 'Expense');
INSERT INTO finance_categories (name, type) VALUES ('Electronics', 'Expense');
INSERT INTO finance_categories (name, type) VALUES ('Dining Out', 'Expense');
INSERT INTO finance_categories (name, type) VALUES ('Breakfast Supplies', 'Expense');
INSERT INTO finance_categories (name, type) VALUES ('Household Items', 'Expense');
INSERT INTO finance_categories (name, type) VALUES ('Christmas Gifts', 'Expense');
INSERT INTO finance_categories (name, type) VALUES ('New Year Party Supplies', 'Expense');
INSERT INTO finance_categories (name, type) VALUES ('Thanksgiving Groceries', 'Expense');
INSERT INTO finance_categories (name, type) VALUES ('Bonus', 'Income');
INSERT INTO finance_categories (name, type) VALUES ('Consulting Work', 'Income');
INSERT INTO finance_categories (name, type) VALUES ('Part-time Job', 'Income');
INSERT INTO finance_categories (name, type) VALUES ('Online Sales', 'Income');
INSERT INTO finance_categories (name, type) VALUES ('Freelance Writing', 'Income');
INSERT INTO finance_categories (name, type) VALUES ('End of Year Bonus', 'Income');
INSERT INTO finance_categories (name, type) VALUES ('Thanksgiving Freelance', 'Income');


-- 4. confirm data was inserted
select * from finance_categories;
-- 1|Groceries|Expense
-- 2|Rent|Expense
-- 3|Salary|Income
-- 4|Freelancing|Income

-- Expenses
-- February 2024
INSERT INTO finance_transactions (category_id, amount, date, description, type, from_asset, name) VALUES (1, 100.50, 1709814000, 'Weekly groceries', 'Expense',1, 'New Expense');
INSERT INTO finance_transactions (category_id, amount, date, description, type, from_asset, name) VALUES (1, 75.25, 1709900400, 'More groceries', 'Expense',1, 'New Expense');
INSERT INTO finance_transactions (category_id, amount, date, description, type, from_asset, name) VALUES (2, 1200, 1707740400, 'Monthly rent', 'Expense',1, 'New Expense');
INSERT INTO finance_transactions (category_id, amount, date, description, type, from_asset, name) VALUES (1, 45.99, 1710082800, 'Snacks and drinks', 'Expense',1, 'New Expense');

-- January 2024
INSERT INTO finance_transactions (category_id, amount, date, description, type, from_asset, name) VALUES (1, 60.00, 1707154800, 'Breakfast supplies', 'Expense',1, 'New Expense');
INSERT INTO finance_transactions (category_id, amount, date, description, type, from_asset, name) VALUES (1, 110.75, 1707241200, 'Household items', 'Expense',1, 'New Expense');
INSERT INTO finance_transactions (category_id, amount, date, description, type, from_asset, name) VALUES (2, 50.25, 1707327600, 'Utilities bill', 'Expense',1, 'New Expense');
INSERT INTO finance_transactions (category_id, amount, date, description, type, from_asset, name) VALUES (1, 200.50, 1707414000, 'Electronics', 'Expense',1, 'New Expense');
INSERT INTO finance_transactions (category_id, amount, date, description, type, from_asset, name) VALUES (1, 15.99, 1707500400, 'Dining out', 'Expense',1, 'New Expense');

-- December 2023
INSERT INTO finance_transactions (category_id, amount, date, description, type, from_asset, name) VALUES (1, 90.00, 1704562800, 'Christmas Gifts', 'Expense',1, 'New Expense');
INSERT INTO finance_transactions (category_id, amount, date, description, type, from_asset, name) VALUES (1, 120.75, 1704649200, 'New Year Party Supplies', 'Expense',1, 'New Expense');

-- November 2023
INSERT INTO finance_transactions (category_id, amount, date, description, type, from_asset, name) VALUES (1, 85.50, 1701970800, 'Thanksgiving Groceries', 'Expense',1, 'New Expense');
INSERT INTO finance_transactions (category_id, amount, date, description, type, from_asset, name) VALUES (2, 900, 1702057200, 'Rent November', 'Expense',1, 'New Expense');


-- Income
-- February 2024
INSERT INTO finance_transactions (category_id, amount, date, description, type, to_asset, name) VALUES (3, 3000, 1709914800, 'Monthly salary', 'Income',1, 'New Income');
INSERT INTO finance_transactions (category_id, amount, date, description, type, to_asset, name) VALUES (4, 500, 1710001200, 'Freelance project', 'Income',1, 'New Income');

-- January 2024
INSERT INTO finance_transactions (category_id, amount, date, description, type, to_asset, name) VALUES (3, 3200, 1707266800, 'Bonus', 'Income',1, 'New Income');
INSERT INTO finance_transactions (category_id, amount, date, description, type, to_asset, name) VALUES (4, 450, 1707353200, 'Consulting work', 'Income',1, 'New Income');
INSERT INTO finance_transactions (category_id, amount, date, description, type, to_asset, name) VALUES (3, 2800, 1707439600, 'Part-time job', 'Income',1, 'New Income');
INSERT INTO finance_transactions (category_id, amount, date, description, type, to_asset, name) VALUES (4, 600, 1707526000, 'Online sales', 'Income',1, 'New Income');
INSERT INTO finance_transactions (category_id, amount, date, description, type, to_asset, name) VALUES (3, 1500, 1707612400, 'Freelance writing', 'Income',1, 'New Income');

-- December 2023
INSERT INTO finance_transactions (category_id, amount, date, description, type, to_asset, name) VALUES (3, 3100, 1704675600, 'End of Year Bonus', 'Income',1, 'New Income');

-- November 2023
INSERT INTO finance_transactions (category_id, amount, date, description, type, to_asset, name) VALUES (4, 700, 1702083600, 'Thanksgiving Freelance', 'Income',1, 'New Income');

-- 5. confirm again
select * from finance_transactions;
-- 1|1|100.5|2023-01-10|Weekly groceries|Expense
-- 2|1|75.25|2023-01-17|More groceries|Expense
-- 3|2|1200.0|2023-01-01|Monthly rent|Expense
-- 4|1|45.99|2023-01-24|Snacks and drinks|Expense
-- 5|3|3000.0|2023-01-15|Monthly salary|Income
-- 6|4|500.0|2023-01-20|Freelance project|Income

-- 6. exit db
.quit