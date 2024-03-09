import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import {
  FiananceAsset,
  FiananceAssetGroup,
  FiananceCategory,
  FiananceTransaction,
} from "../model/types";
import { useSQLiteContext } from "expo-sqlite/next";
import {
  assetGroupTableName,
  assetTableName,
  categoryTableName,
  transactionTabelName,
} from "../model/constants";
import TransactionList from "../components/TransactionList";

const Home = () => {
  const [categories, setCategories] = useState<FiananceCategory[]>([]);
  const [transactions, setTransactions] = useState<FiananceTransaction[]>([]);

  const [assetGroups, setAssetGroups] = useState<FiananceAssetGroup[]>([]);
  const [assets, setAssets] = useState<FiananceAsset[]>([]);

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
    console.log("Done! 🔥");
  };

  const deleteTransaction = async (id: number) => {
    await console.log("Delete Transaction 🌋 - id = " + id);
  };

  return (
    <View>
      <ScrollView contentContainerStyle={{ padding: 15, paddingVertical: 30 }}>
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

export default Home;
