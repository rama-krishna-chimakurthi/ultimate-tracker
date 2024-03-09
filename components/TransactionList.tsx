import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import {
  FiananceAsset,
  FiananceAssetGroup,
  FiananceCategory,
  FiananceTransaction,
} from "../model/types";
import TransactionListItem from "./TransactionListItem";

const TransactionList = ({
  transactions,
  categories,
  assetGroups,
  assets,
  deleteTransaction,
}: {
  transactions: FiananceTransaction[];
  categories: FiananceCategory[];
  assetGroups: FiananceAssetGroup[];
  assets: FiananceAsset[];
  deleteTransaction: (transactionId: number) => Promise<void>;
}) => {
  return (
    <View style={{ gap: 15 }}>
      {transactions.map((transaction) => {
        const categoryForCurrentItem = categories.find(
          (category) => category.id === transaction.category_id
        );
        const fromAssetForCurrentItem = assets.find(
          (asset) => asset.id === transaction.from_asset
        );
        const toAssetForCurrentItem = assets.find(
          (asset) => asset.id === transaction.to_asset
        );
        return (
          <TouchableOpacity
            key={transaction.id}
            activeOpacity={0.7}
            onLongPress={() => deleteTransaction(transaction.id!)}
          >
            <TransactionListItem
              transaction={transaction}
              categoryInfo={categoryForCurrentItem}
              fromAsset={fromAssetForCurrentItem}
              toAsset={toAssetForCurrentItem}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TransactionList;
