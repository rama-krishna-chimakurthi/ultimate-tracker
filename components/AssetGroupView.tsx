import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import {
  FiananceAsset,
  FiananceAssetGroup,
  TransactionsByMonth,
} from "../model/types";
import Card from "./ui/Card";
import { useSQLiteContext } from "expo-sqlite/next";
import { assetTableName, transactionTabelName } from "../model/constants";
import { useIsFocused } from "@react-navigation/native";
import { Amount } from "./TransactionListItem";
import { Ionicons } from "@expo/vector-icons";

const AssetGroupView = ({
  assetGroup,
  assets,
  deleteAsset,
}: {
  assetGroup: FiananceAssetGroup;
  assets: FiananceAsset[];
  deleteAsset: (assetId: number, isDeleted: boolean) => Promise<void>;
}) => {
  return (
    <View>
      {assets.length > 0 && (
        <Card style={{ margin: 10, padding: 15 }}>
          {/* <Text>{assetGroup.name}</Text> */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 5,
            }}
          >
            {/* <View style={{ flex: 1, height: 1, backgroundColor: "black" }} /> */}
          </View>
          {assets.map((asset) => {
            //console.log("👉", asset);
            return (
              <View key={asset.id}>
                <AssetView asset={asset} deleteAsset={deleteAsset} />
              </View>
            );
          })}
        </Card>
      )}
    </View>
  );
};

export default AssetGroupView;

const AssetView = ({
  asset,
  deleteAsset,
}: {
  asset: FiananceAsset;
  deleteAsset(assetId: number, isDeleted: boolean): Promise<void>;
}) => {
  const isFocused = useIsFocused();
  const [transactionsSummary, setTransactionsSummary] =
    useState<TransactionsByMonth>({
      totalExpenses: 0,
      totalIncome: 0,
    });

  const db = useSQLiteContext();

  useEffect(() => {
    db.withTransactionAsync(async () => {
      await getData();
    });
  }, [db, isFocused === true]);

  const getData = async () => {
    const transactionsByMonth = await db.getAllAsync<TransactionsByMonth>(
      `
      SELECT
        COALESCE(SUM(CASE WHEN from_asset = ? THEN amount ELSE 0 END), 0) AS totalExpenses,
        COALESCE(SUM(CASE WHEN to_asset = ? THEN amount ELSE 0 END), 0) AS totalIncome
      FROM ${transactionTabelName};
    `,
      [asset.id, asset.id]
    );
    setTransactionsSummary(transactionsByMonth[0]);
    /* console.log(
      "transactionsByMonth, asset name",
      transactionsByMonth,
      asset.name
    ); */
    console.log("Done! 🤑");
  };
  const total =
    transactionsSummary.totalIncome - transactionsSummary.totalExpenses;
  const color = total < 0 ? "red" : "green";
  const iconName = total < 0 ? "minuscircle" : "pluscircle";

  return (
    <View style={{ paddingVertical: 15 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <View style={{ minWidth: "40%", gap: 3 }}>
          <Amount amount={total} color={color} iconName={iconName} />
        </View>
        <View
          style={{
            flexGrow: 1,
            gap: 6,
            flexShrink: 1,
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>{asset.name}</Text>
          <View></View>
        </View>
        <View style={{ width: "8%", justifyContent: "center" }}>
          <Pressable onPress={() => deleteAsset(asset.id, !asset.isDeleted)}>
            <Ionicons
              name={asset.isDeleted ? "eye-off" : "eye"}
              size={24}
              color="black"
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};
