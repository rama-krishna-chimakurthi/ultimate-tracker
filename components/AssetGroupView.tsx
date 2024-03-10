import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import {
  FiananceAsset,
  FiananceAssetGroup,
  TransactionsByMonth,
} from "../model/types";
import Card from "./ui/Card";
import { useSQLiteContext } from "expo-sqlite/next";
import { assetTableName, transactionTabelName } from "../model/constants";

const AssetGroupView = ({
  assetGroup,
  assets,
}: {
  assetGroup: FiananceAssetGroup;
  assets: FiananceAsset[];
}) => {
  return (
    <View>
      {assets.length > 0 && (
        <Card style={{ margin: 10, padding: 15 }}>
          <Text>{assetGroup.name}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 5,
            }}
          >
            <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
          </View>
          {assets.map((asset) => {
            return (
              <View key={asset.id}>
                <AssetView asset={asset} />
              </View>
            );
          })}
        </Card>
      )}
    </View>
  );
};

export default AssetGroupView;

const AssetView = ({ asset }: { asset: FiananceAsset }) => {
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
  }, [db]);

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
  };

  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text>{asset.name}</Text>
        <Text>
          ₹{transactionsSummary.totalIncome - transactionsSummary.totalExpenses}
        </Text>
      </View>
    </View>
  );
};
