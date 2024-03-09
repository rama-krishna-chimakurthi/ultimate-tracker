import { View, Text, ScrollView, StyleSheet, TextStyle } from "react-native";
import React, { useEffect, useState } from "react";
import {
  FiananceAsset,
  FiananceAssetGroup,
  FiananceCategory,
  FiananceTransaction,
  TransactionsByMonth,
} from "../model/types";
import { useSQLiteContext } from "expo-sqlite/next";
import {
  assetGroupTableName,
  assetTableName,
  categoryTableName,
  transactionTabelName,
} from "../model/constants";
import TransactionList from "../components/TransactionList";
import Card from "../components/ui/Card";
import AddTransaction from "../components/AddTransaction";

const Home = () => {
  const [categories, setCategories] = useState<FiananceCategory[]>([]);
  const [transactions, setTransactions] = useState<FiananceTransaction[]>([]);

  const [assetGroups, setAssetGroups] = useState<FiananceAssetGroup[]>([]);
  const [assets, setAssets] = useState<FiananceAsset[]>([]);

  const [transactionsByMonth, setTransactionsByMonth] =
    useState<TransactionsByMonth>({
      totalExpenses: 0,
      totalIncome: 0,
    });

  const db = useSQLiteContext();

  useEffect(() => {
    db.withTransactionAsync(async () => {
      await getData();
    });
  }, [db]);

  const getData = async () => {
    const resultCategory = await db.getAllAsync<FiananceCategory>(
      `SELECT * FROM ${categoryTableName}`
    );
    const resultTransactions = await db.getAllAsync<FiananceTransaction>(
      `SELECT * FROM ${transactionTabelName} ORDER BY date DESC`
    );
    const resultAssetGroup = await db.getAllAsync<FiananceAssetGroup>(
      `SELECT * FROM ${assetGroupTableName}`
    );
    const resultAssets = await db.getAllAsync<FiananceAsset>(
      `SELECT * FROM ${assetTableName}`
    );

    setCategories(resultCategory);
    setTransactions(resultTransactions);
    setAssetGroups(resultAssetGroup);
    setAssets(resultAssets);

    const now = new Date();
    // Set to the first day of the current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    // Get the first day of the next month, then subtract one millisecond to get the end of the current month
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    endOfMonth.setMilliseconds(endOfMonth.getMilliseconds() - 1);

    // Convert to Unix timestamps (seconds)
    const startOfMonthTimestamp = Math.floor(startOfMonth.getTime() / 1000);
    const endOfMonthTimestamp = Math.floor(endOfMonth.getTime() / 1000);

    const transactionsByMonth = await db.getAllAsync<TransactionsByMonth>(
      `
      SELECT
        COALESCE(SUM(CASE WHEN type = 'Expense' THEN amount ELSE 0 END), 0) AS totalExpenses,
        COALESCE(SUM(CASE WHEN type = 'Income' THEN amount ELSE 0 END), 0) AS totalIncome
      FROM ${transactionTabelName}
      WHERE date >= ? AND date <= ?;
    `,
      [startOfMonthTimestamp, endOfMonthTimestamp]
    );
    setTransactionsByMonth(transactionsByMonth[0]);

    console.log("Done! 🔥");
  };

  const insertTransaction = async (transaction: FiananceTransaction) => {
    db.withTransactionAsync(async () => {
      await db.runAsync(
        `
        INSERT INTO ${transactionTabelName} (category_id, amount, date, description, type, from_asset, to_asset, name) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
      `,
        [
          transaction.category_id,
          transaction.amount,
          transaction.date,
          transaction.description,
          transaction.type,
          transaction.from_asset ? transaction.from_asset : null,
          transaction.to_asset ? transaction.to_asset : null,
          transaction.name,
        ]
      );
      await getData();
    });
  };

  const deleteTransaction = async (id: number) => {
    console.log("Delete Transaction 🌋 - id = " + id);
    await db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM ${transactionTabelName} WHERE id = ?;`, [
        id,
      ]);
      await getData();
    });
  };

  return (
    <View>
      <ScrollView contentContainerStyle={{ padding: 15, paddingVertical: 30 }}>
        <AddTransaction insertTransaction={insertTransaction} assets={assets} />
        <TransactionSummary
          totalExpenses={transactionsByMonth.totalExpenses}
          totalIncome={transactionsByMonth.totalIncome}
        />
        <TransactionList
          assetGroups={assetGroups}
          assets={assets}
          categories={categories}
          transactions={transactions}
          deleteTransaction={deleteTransaction}
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
