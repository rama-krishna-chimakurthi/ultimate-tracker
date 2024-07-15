import { MigrationInterface, QueryRunner } from "typeorm";

export class NotesAndPasswordCreation1721036886845 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`CREATE TABLE IF NOT EXISTS passwords_table (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            userName TEXT NOT NULL,
            email TEXT NOT NULL,
            website TEXT NOT NULL,
            password TEXT NOT NULL,
            dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            lastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            expiringOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            nextReminder TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            category TEXT NOT NULL CHECK (category IN ('Bank', 'Social'))
        );`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS notes_table (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT,
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            lastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );`)

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
