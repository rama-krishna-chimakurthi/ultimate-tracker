import { PasswordEntity } from "../entities/PasswordEntity";
import { FinanceAsset } from "../entities/FinanceAsset";
import { FinanceAssetGroup } from "../entities/FinanceAssetGroup";
import { FinanceTransaction } from "../entities/FinanceTransaction";
import { CreateMasterData1720946451792 } from "../db/migrations/1720946451792-CreateMasterData";
import { FinanceCategory } from "../entities/FinanceCategory";
import { PasswordRepo } from "../repo/PasswordRepo";
import { FinanceAssetRepo } from "../repo/FinanceAssetRepo";
import { FinanceAssetGroupRepo } from "../repo/FinanceAssetGroupRepo";
import { FinanceTransactionRepo } from "../repo/FinanceTransactionRepo";
import { FinanceCategoryRepo } from "../repo/FinanceCategoryRepo";
import * as SQLite from 'expo-sqlite/legacy';

//import * as FileSystem from "expo-file-system";


import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Connection, createConnection, DataSource } from 'typeorm';



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
    migrations: [CreateMasterData1720946451792],
    migrationsRun: true
});