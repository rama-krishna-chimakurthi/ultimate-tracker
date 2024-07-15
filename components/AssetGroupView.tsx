import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { TransactionsByMonth } from "../model/types";
import Card from "./ui/Card";

import { assetTableName, transactionTableName } from "../model/constants";
import { useIsFocused } from "@react-navigation/native";
import { Amount } from "./TransactionListItem";
import { Ionicons } from "@expo/vector-icons";
import { FinanceAssetGroup } from "../entities/FinanceAssetGroup";
import { FinanceAsset } from "../entities/FinanceAsset";

const AssetGroupView = ({
  assetGroup,
  assets,
  deleteAsset,
}: {
  assetGroup: FinanceAssetGroup;
  assets: FinanceAsset[];
  deleteAsset: (assetId: number, isDeleted: boolean) => Promise<void>;
}) => {
  return (
    <View>
      {assets.length > 0 && (
        <Card style={{ margin: 10, padding: 15 }}>
          <Text style={styles.periodTitle}>{assetGroup.name}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 0,
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
  asset: FinanceAsset;
  deleteAsset(assetId: number, isDeleted: boolean): Promise<void>;
}) => {
  const isFocused = useIsFocused();

  useEffect(() => {
    console.log("asset - ", asset);
  }, []);

  const color = asset.amount < 0 ? "red" : "green";
  const iconName = asset.amount < 0 ? "minuscircle" : "pluscircle";

  return (
    <View style={{ paddingVertical: 15 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <View style={{ minWidth: "40%", gap: 3 }}>
          <Amount amount={asset.amount} color={color} iconName={iconName} />
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
        {/* <View style={{ width: "8%", justifyContent: "center" }}>
          <Pressable onPress={() => deleteAsset(asset.id, !asset.isDeleted)}>
            <Ionicons
              name={asset.isDeleted ? "eye-off" : "eye"}
              size={24}
              color="black"
            />
          </Pressable>
        </View> */}
      </View>
    </View>
  );
};

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
