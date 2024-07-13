import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite/next";
import {
  assetGroupTableName,
  assetTableName,
  transactionTabelName,
} from "../model/constants";
import {
  FiananceAsset,
  FiananceAssetGroup,
  TransactionsByMonth,
} from "../model/types";
import AssetGroupView from "../components/AssetGroupView";
import { useIsFocused } from "@react-navigation/native";
import AddAsset from "../components/AddAsset";

const AssetsScreen = () => {
  const isFocused = useIsFocused();
  const [assetGroups, setAssetGroups] = useState<FiananceAssetGroup[]>([]);
  const [assets, setAssets] = useState<FiananceAsset[]>([]);

  const db = useSQLiteContext();

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    setAssetGroups([]);
    setAssets([]);
    db.withTransactionAsync(async () => {
      getData().then(() => {
        console.log("Data retrieved!");
      });
    });
  }, [isFocused]);

  const getData = async () => {
    const resultAssetGroup = await db.getAllAsync<FiananceAssetGroup>(
      `SELECT * FROM ${assetGroupTableName}`
    );
    const resultAssets = await db.getAllAsync<FiananceAsset>(
      `SELECT * FROM ${assetTableName}`
    );

    setAssetGroups(resultAssetGroup);

    const trans: TransactionsByMonth[] = await getAssetAmount();
    resultAssets.forEach((asset) => {
      const asset_tran: TransactionsByMonth[] = trans.filter(
        (tran) => asset.id === tran.id
      );
      asset.amount =
        asset_tran.length > 0
          ? asset_tran[0].totalIncome - asset_tran[0].totalExpenses
          : 0;
    });

    setAssets(resultAssets);

    //console.log(resultAssets);

    console.log("Done! 🔥");
  };

  /* const storeAmount = async (assets: FiananceAsset[]) => {
    assets.forEach(async (asset) => {
      asset.amount = await getAssetAmount(asset);
    });
  }; */

  const getAssetAmount = async () => {
    const transactionsByMonth = await db.getAllAsync<TransactionsByMonth>(
      `
      SELECT ${assetTableName}.id, COALESCE(SUM(CASE WHEN from_asset = ${assetTableName}.id THEN amount ELSE 0 END), 0) AS totalExpenses,
              COALESCE(SUM(CASE WHEN to_asset = ${assetTableName}.id THEN amount ELSE 0 END), 0) AS totalIncome
      FROM ${assetTableName}
      join ${transactionTabelName}
      on ${transactionTabelName}.from_asset = ${assetTableName}.id or ${transactionTabelName}.to_asset = ${assetTableName}.id
      group by ${assetTableName}.id
      `
    );
    console.log("Done! 🤑");
    return transactionsByMonth;
  };

  const insertAsset = async (asset: FiananceAsset) => {
    if (asset.id > 0) {
      /* db.withTransactionAsync(async () => {
        await db.runAsync(
          `UPDATE ${transactionTabelName} SET amount =?, description =?, category_id =?, date =?, type=?, from_asset=?, to_asset=?, name=? WHERE id =?`,
          [
            transaction.amount,
            transaction.description,
            transaction.category_id,
            transaction.date,
            transaction.type,
            transaction.from_asset ? transaction.from_asset : null,
            transaction.to_asset ? transaction.to_asset : null,
            transaction.name,
            transaction.id,
          ]
        );
        await getData();
      }); */
    } else {
      await db.withTransactionAsync(async () => {
        await db.runAsync(
          `
          INSERT INTO ${assetTableName} (name, asset_group_id, settlement_day) VALUES (?, ?, ?);
        `,
          [
            asset.name,
            asset.asset_group_id,
            asset.settlement_day ? asset.settlement_day : null,
          ]
        );
        await getData();
      });
    }
  };

  const toggleAssetDeletion = async (assetId: number, isDeleted: boolean) => {
    db.withTransactionAsync(async () => {
      await db.runAsync(
        `UPDATE ${assetTableName} set isDeleted = ? WHERE id =?`,
        [isDeleted ? 1 : 0, assetId]
      );
      await getData();
    });
  };

  return (
    <View>
      <View style={{ padding: 10 }}>
        <AddAsset assetGroups={assetGroups} insertAsset={insertAsset} />
      </View>
      {assetGroups &&
        assets &&
        assetGroups.map((assetGroup) => {
          return (
            <View key={assetGroup.id}>
              <AssetGroupView
                assetGroup={assetGroup}
                assets={assets.filter(
                  (asset) => asset.asset_group_id === assetGroup.id
                )}
                deleteAsset={(assetId: number, isDeleted: boolean) =>
                  toggleAssetDeletion(assetId, isDeleted)
                }
              />
            </View>
          );
        })}
    </View>
  );
};

export default AssetsScreen;
