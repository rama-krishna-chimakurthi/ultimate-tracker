import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite/next";
import { assetGroupTableName, assetTableName } from "../model/constants";
import { FiananceAsset, FiananceAssetGroup } from "../model/types";
import AssetGroupView from "../components/AssetGroupView";
import { useIsFocused } from "@react-navigation/native";
import AddAsset from "../components/AddAsset";

const AssetsScreen = () => {
  const isFocused = useIsFocused();
  const [assetGroups, setAssetGroups] = useState<FiananceAssetGroup[]>([]);
  const [assets, setAssets] = useState<FiananceAsset[]>([]);

  const db = useSQLiteContext();

  useEffect(() => {
    db.withTransactionAsync(async () => {
      await getData();
    });
  }, [db, isFocused == true]);

  const getData = async () => {
    const resultAssetGroup = await db.getAllAsync<FiananceAssetGroup>(
      `SELECT * FROM ${assetGroupTableName}`
    );
    const resultAssets = await db.getAllAsync<FiananceAsset>(
      `SELECT * FROM ${assetTableName}`
    );

    setAssetGroups(resultAssetGroup);
    setAssets(resultAssets);

    //console.log(resultAssets);

    console.log("Done! 🔥");
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
      db.withTransactionAsync(async () => {
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
      {assetGroups.map((assetGroup) => {
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
