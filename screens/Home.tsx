import { View, Text, ScrollView, StyleSheet, TextStyle } from "react-native";
import React, { useEffect, useState } from "react";
import {
  assetGroupTableName,
  assetTableName,
  categoryTableName,
  transactionTableName,
} from "../model/constants";
import TransactionList from "../components/TransactionList";
import Card from "../components/ui/Card";
import AddTransaction from "../components/AddTransaction";
import { useIsFocused } from "@react-navigation/native";
import { FinanceTransaction } from "../entities/FinanceTransaction";
import { FinanceTransactionRepo } from "../repo/FinanceTransactionRepo";
import { dataSource } from "../services/DataService";
import { TransactionsByMonth } from "../model/types";
import { Between, Transaction } from "typeorm";
import { FinanceAsset } from "../entities/FinanceAsset";
import { FinanceAssetGroup } from "../entities/FinanceAssetGroup";
import { FinanceCategory } from "../entities/FinanceCategory";

const Home = () => {
  //const [categories, setCategories] = useState<FinanceCategory[]>([]);
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);

  //const [assetGroups, setAssetGroups] = useState<FinanceAssetGroup[]>([]);
  //const [assets, setAssets] = useState<FinanceAsset[]>([]);

  const [editTransaction, setEditTransaction] = useState<
    FinanceTransaction | undefined
  >(undefined);

  const [transactionsByMonth, setTransactionsByMonth] =
    useState<TransactionsByMonth>({
      totalExpenses: 0,
      totalIncome: 0,
    });

  const transactionRepo = dataSource.getRepository(FinanceTransaction);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    /* const connect = async () => {
      await dataSource
        .initialize()
        .then(() => {
          console.log("Database connected successfully");
          })
        .catch((e) => console.error(e));
        };
        connect(); 
    */

    //db.withTransactionAsync(async () => {
    getData();
    //});
  }, [isFocused]);

  const editTransactionClicked = (transaction: FinanceTransaction) => {
    //console.log("editTransactionClicked", transaction);
    setEditTransaction(transaction);
  };

  const getData = async () => {
    /* const resultCategory = await db.getAllAsync<FinanceCategory>(
      `SELECT * FROM ${categoryTableName}`
    );
    const resultTransactions = await db.getAllAsync<FinanceTransaction>(
      `SELECT * FROM ${transactionTabelName} ORDER BY date DESC`
    );
    const resultAssetGroup = await db.getAllAsync<FinanceAssetGroup>(
      `SELECT * FROM ${assetGroupTableName} WHERE isDeleted = ?`,
      [0]
    );
    const resultAssets = await db.getAllAsync<FinanceAsset>(
      `SELECT * FROM ${assetTableName} WHERE isDeleted = ?`,
      [0]
    );

    setCategories(resultCategory); */

    //const assets = await dataSource.getRepository(FinanceCategory).find();
    //console.log("assets - ", assets);

    const resultTransactions = await transactionRepo.find({
      order: {
        transactionDate: "DESC",
      },
    });

    console.log("resultTransactions - ", resultTransactions);

    setTransactions(resultTransactions);
    /* setAssetGroups(resultAssetGroup);
    setAssets(resultAssets); */

    //console.log("resultTransactions - ", resultTransactions);

    const now = new Date();
    // Set to the first day of the current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    // Get the first day of the next month, then subtract one millisecond to get the end of the current month
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    endOfMonth.setMilliseconds(endOfMonth.getMilliseconds() - 1);

    // Convert to Unix timestamps (seconds)
    //const startOfMonthTimestamp = Math.floor(startOfMonth.getTime() / 1000);
    //const endOfMonthTimestamp = Math.floor(endOfMonth.getTime() / 1000);

    // const queryRunner = dataSource.createQueryRunner();

    /* const entityManager = dataSource.createEntityManager(queryRunner);

    const transactionsByMonth = await entityManager.query(
      `
      SELECT
        COALESCE(SUM(CASE WHEN type = 'Expense' THEN amount ELSE 0 END), 0) AS totalExpenses,
        COALESCE(SUM(CASE WHEN type = 'Income' THEN amount ELSE 0 END), 0) AS totalIncome
      FROM ${transactionTableName}
      WHERE transaction_date >= ? AND transaction_date <= ?;
    `,
      [startOfMonth, endOfMonth]
    ); */

    const transactionsByMonth = await dataSource
      .createQueryBuilder()
      .select([
        "COALESCE(SUM(CASE WHEN tr.type = 'Expense' THEN tr.amount ELSE 0 END), 0) AS totalExpenses",
        "COALESCE(SUM(CASE WHEN tr.type = 'Income' THEN tr.amount ELSE 0 END), 0) AS totalIncome",
      ])
      .from(transactionTableName, "tr")
      .where({
        transactionDate: Between(startOfMonth, endOfMonth),
      })
      .execute();

    console.log("transactionsByMonth - ", transactionsByMonth);

    setTransactionsByMonth(transactionsByMonth[0]);

    console.log("Done! 🔥");
  };

  const deleteTransaction = async (id: number) => {
    console.log("Delete Transaction 🌋 - id = " + id);
    await transactionRepo.delete(id);
    await getData();
    /* await db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM ${transactionTabelName} WHERE id = ?;`, [
        id,
      ]);
      await getData();
    }); */
  };

  return (
    <View>
      <ScrollView contentContainerStyle={{ padding: 15, paddingVertical: 30 }}>
        <AddTransaction
          transaction={editTransaction}
          removeTransaction={() => {
            setEditTransaction(undefined);
            getData();
          }}
        />
        <TransactionSummary
          totalExpenses={transactionsByMonth.totalExpenses}
          totalIncome={transactionsByMonth.totalIncome}
        />
        <TransactionList
          transactions={transactions}
          deleteTransaction={deleteTransaction}
          editTransaction={editTransactionClicked}
        />
      </ScrollView>
    </View>
  );
};

function TransactionSummary({
  totalIncome,
  totalExpenses,
}: TransactionsByMonth) {
  const savings = totalIncome - totalExpenses;
  const readablePeriod = new Date().toLocaleDateString("default", {
    month: "long",
    year: "numeric",
  });

  // Function to determine the style based on the value (positive or negative)
  const getMoneyTextStyle = (value: number): TextStyle => ({
    fontWeight: "bold",
    color: value < 0 ? "#ff4500" : "#2e8b57", // Red for negative, custom green for positive
  });

  // Helper function to format monetary values
  const formatMoney = (value: number) => {
    const absValue = Math.abs(value).toFixed(2);
    return `${value < 0 ? "-" : ""}₹${absValue}`;
  };

  return (
    <Card style={styles.container}>
      <Text style={styles.periodTitle}>Summary for {readablePeriod}</Text>
      <Text style={styles.summaryText}>
        Income:{" "}
        <Text style={getMoneyTextStyle(totalIncome)}>
          {formatMoney(totalIncome)}
        </Text>
      </Text>
      <Text style={styles.summaryText}>
        Total Expenses:{" "}
        <Text style={getMoneyTextStyle(totalExpenses)}>
          {formatMoney(totalExpenses)}
        </Text>
      </Text>
      <Text style={styles.summaryText}>
        Savings:{" "}
        <Text style={getMoneyTextStyle(savings)}>{formatMoney(savings)}</Text>
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    paddingBottom: 7,
    // Add other container styles as necessary
  },
  periodTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  summaryText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
  // Removed moneyText style since we're now generating it dynamically
});

export default Home;
