import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";

import {
  assetGroupTableName,
  assetTableName,
  transactionTableName,
} from "../model/constants";

import AssetGroupView from "../components/AssetGroupView";
import { useIsFocused } from "@react-navigation/native";
import AddAsset from "../components/AddAsset";
import { FinanceAssetGroup } from "../entities/FinanceAssetGroup";
import { FinanceAsset } from "../entities/FinanceAsset";
import { dataSource } from "../services/DataService";
import { TransactionsByMonth } from "../model/types";

const AssetsScreen = () => {
  const isFocused = useIsFocused();
  const [assetGroups, setAssetGroups] = useState<FinanceAssetGroup[]>([]);
  const [assets, setAssets] = useState<FinanceAsset[]>([]);

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    setAssetGroups([]);
    setAssets([]);
    getData();
  }, [isFocused]);

  const getData = async () => {
    const resultAssetGroup = await dataSource
      .getRepository(FinanceAssetGroup)
      .find();
    setAssetGroups(resultAssetGroup);
    const resultAssets = await dataSource.getRepository(FinanceAsset).find();

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

  /* const storeAmount = async (assets: FinanceAsset[]) => {
    assets.forEach(async (asset) => {
      asset.amount = await getAssetAmount(asset);
    });
  }; */

  const getAssetAmount = async () => {
    const queryRunner = dataSource.createQueryRunner();
    const transactionsByMonth: TransactionsByMonth[] = await queryRunner.query(
      `
      SELECT ${assetTableName}.id, COALESCE(SUM(CASE WHEN from_asset = ${assetTableName}.id THEN amount ELSE 0 END), 0) AS totalExpenses,
              COALESCE(SUM(CASE WHEN to_asset = ${assetTableName}.id THEN amount ELSE 0 END), 0) AS totalIncome
      FROM ${assetTableName}
      join ${transactionTableName}
      on ${transactionTableName}.from_asset = ${assetTableName}.id or ${transactionTableName}.to_asset = ${assetTableName}.id
      group by ${assetTableName}.id
      `
    );
    console.log("Done! 🤑");
    return transactionsByMonth;
  };

  const insertAsset = async (asset: FinanceAsset) => {
    if (asset.id < 0) {
      asset.id = null;
      console.log("New Asset Adding----");
    }
    await dataSource.getRepository(FinanceAsset).save(asset);
    await getData();
  };

  const toggleAssetDeletion = async (assetId: number, isDeleted: boolean) => {
    await dataSource.getRepository(FinanceAsset).update(assetId, {
      isDeleted,
    });
    await getData();

    /* db.withTransactionAsync(async () => {
      await db.runAsync(
        `UPDATE ${assetTableName} set isDeleted = ? WHERE id =?`,
        [isDeleted ? 1 : 0, assetId]
      );
    }); */
  };

  return (
    <View>
      <ScrollView>
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
                    (asset) => asset.assetGroup.id === assetGroup.id
                  )}
                  deleteAsset={(assetId: number, isDeleted: boolean) =>
                    toggleAssetDeletion(assetId, isDeleted)
                  }
                />
              </View>
            );
          })}
      </ScrollView>
    </View>
  );
};

export default AssetsScreen;
