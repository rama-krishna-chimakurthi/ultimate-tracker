import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMasterData1720946451792 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`CREATE TABLE IF NOT EXISTS finance_categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            isDeleted BOOLEAN default false,
            type TEXT NOT NULL CHECK (type IN ('Expense', 'Income'))
        );`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS finance_asset_group (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            isDeleted BOOLEAN default false
        );`)
        await queryRunner.query(`CREATE TABLE finance_asset (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            isDeleted BOOLEAN default false,
            settlement_day TIMESTAMP,
            payment_day TIMESTAMP,
            asset_group_id INTEGER,
            FOREIGN KEY (asset_group_id) REFERENCES finance_asset_group (id)
        );`)
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS finance_transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL NOT NULL,
            transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            type TEXT NOT NULL CHECK (type IN ('Expense', 'Income', 'Difference', 'Transfer')),
            date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            category_id INTEGER,
            from_asset INTEGER,
            to_asset INTEGER,
            FOREIGN KEY (category_id) REFERENCES finance_categories (id),
            FOREIGN KEY (from_asset) REFERENCES finance_asset (id),
            FOREIGN KEY (to_asset) REFERENCES finance_asset (id)
        );`)

        await queryRunner.query(`INSERT INTO finance_categories (name, type) VALUES ('Loans', 'Expense');`)
        await queryRunner.query(`INSERT INTO finance_categories (name, type) VALUES ('Bills & Utilities', 'Expense');`)
        await queryRunner.query(`INSERT INTO finance_categories (name, type) VALUES ('Entertainment & Social Life', 'Expense');`)
        await queryRunner.query(`INSERT INTO finance_categories (name, type) VALUES ('Office Travel', 'Expense');`)
        await queryRunner.query(`INSERT INTO finance_categories (name, type) VALUES ('Travel', 'Expense');`)
        await queryRunner.query(`INSERT INTO finance_categories (name, type) VALUES ('Groceries and Household', 'Expense');`)
        await queryRunner.query(`INSERT INTO finance_categories (name, type) VALUES ('Office Food', 'Expense');`)
        await queryRunner.query(`INSERT INTO finance_categories (name, type) VALUES ('Food', 'Expense');`)
        await queryRunner.query(`INSERT INTO finance_categories (name, type) VALUES ('Health and Wellness', 'Expense');`)
        await queryRunner.query(`INSERT INTO finance_categories (name, type) VALUES ('Shopping', 'Expense');`)
        await queryRunner.query(`INSERT INTO finance_categories (name, type) VALUES ('Salary', 'Income');`)
        await queryRunner.query(`INSERT INTO finance_categories (name, type) VALUES ('Bonus', 'Income');`)
        await queryRunner.query(`INSERT INTO finance_categories (name, type) VALUES ('Parents', 'Income');`)
        await queryRunner.query(`INSERT INTO finance_asset_group (name) VALUES ('Cash');`)
        await queryRunner.query(`INSERT INTO finance_asset_group (name) VALUES ('Accounts');`)
        await queryRunner.query(`INSERT INTO finance_asset_group (name) VALUES ('Credit Card');`)
        await queryRunner.query(`INSERT INTO finance_asset_group (name) VALUES ('Investments');`)
        await queryRunner.query(`INSERT INTO finance_asset_group (name) VALUES ('Overdrafts');`)
        await queryRunner.query(`INSERT INTO finance_asset_group (name) VALUES ('Loan');`)
        await queryRunner.query(`INSERT INTO finance_asset_group (name) VALUES ('Insurance');`)
        await queryRunner.query(`INSERT INTO finance_asset_group (name) VALUES ('Person');`)
        await queryRunner.query(`INSERT INTO finance_asset_group (name) VALUES ('Others');`)
        await queryRunner.query(`INSERT INTO finance_asset (name, asset_group_id) VALUES ('Cash',1);`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
