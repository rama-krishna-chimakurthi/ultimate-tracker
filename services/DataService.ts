import { PasswordEntity } from "../entities/PasswordEntity";
import { FinanceAsset } from "../entities/FinanceAsset";
import { FinanceAssetGroup } from "../entities/FinanceAssetGroup";
import { FinanceTransaction } from "../entities/FinanceTransaction";
import { CreateMasterData1720946451792 } from "../db/migrations/1720946451792-CreateMasterData";
import { FinanceCategory } from "../entities/FinanceCategory";
import * as SQLite from 'expo-sqlite/legacy';

import { DataSource } from 'typeorm';
import { NotesAndPasswordCreation1721036886845 } from "../db/migrations/1721036886845-NotesAndPasswordCreation";



const dbName = "ultimate-tracker.db";

export const dataSource = new DataSource({
    database: dbName,
    entities: [
        PasswordEntity,
        FinanceCategory,
        FinanceAssetGroup,
        FinanceAsset,
        FinanceTransaction
    ],
    //location: `${FileSystem.documentDirectory}SQLite/${dbName}`,
    logging: ["error", "info", "warn", "migration", "log", "query", "schema"],
    synchronize: false,
    type: 'expo',
    driver: SQLite,
    migrations: [CreateMasterData1720946451792, NotesAndPasswordCreation1721036886845],
    migrationsRun: true
});