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
      <Card>
        <Text>{assetGroup.name}</Text>
        <Text>Text</Text>
      </Card>
      {assets.map((asset) => {
        return (
          <View>
            <AssetView asset={asset} />
          </View>
        );
      })}
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
      <Card></Card>
    </View>
  );
};
