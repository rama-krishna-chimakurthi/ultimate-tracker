import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite/next";
import { assetGroupTableName, assetTableName } from "../model/constants";
import { FiananceAsset, FiananceAssetGroup } from "../model/types";
import AssetGroupView from "../components/AssetGroupView";

const AssetsScreen = () => {
  const [assetGroups, setAssetGroups] = useState<FiananceAssetGroup[]>([]);
  const [assets, setAssets] = useState<FiananceAsset[]>([]);

  const db = useSQLiteContext();

  useEffect(() => {
    db.withTransactionAsync(async () => {
      await getData();
    });
  }, [db]);

  const getData = async () => {
    const resultAssetGroup = await db.getAllAsync<FiananceAssetGroup>(
      `SELECT * FROM ${assetGroupTableName}`
    );
    const resultAssets = await db.getAllAsync<FiananceAsset>(
      `SELECT * FROM ${assetTableName}`
    );

    setAssetGroups(resultAssetGroup);
    setAssets(resultAssets);

    console.log("Done! 🔥");
  };

  return (
    <View>
      {assetGroups.map((assetGroup) => {
        return (
          <View key={assetGroup.id}>
            <AssetGroupView
              assetGroup={assetGroup}
              assets={assets.filter(
                (asset) =>
                  asset.asset_group_id === assetGroup.id && !asset.isDeleted
              )}
            />
          </View>
        );
      })}
    </View>
  );
};

export default AssetsScreen;
