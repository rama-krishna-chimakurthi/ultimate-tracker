import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

import TransactionListItem from "./TransactionListItem";
import { FinanceTransaction } from "../entities/FinanceTransaction";

const TransactionList = ({
  transactions,
  deleteTransaction,
  editTransaction,
}: {
  transactions: FinanceTransaction[];
  deleteTransaction: (transactionId: number) => Promise<void>;
  editTransaction: (transaction: FinanceTransaction) => void;
}) => {
  return (
    <View style={{ gap: 15 }}>
      {transactions.map((transaction) => {
        const categoryForCurrentItem = transaction.category;
        const fromAssetForCurrentItem = transaction.fromAsset;
        const toAssetForCurrentItem = transaction.toAsset;
        return (
          <TouchableOpacity
            key={transaction.id}
            activeOpacity={0.7}
            onLongPress={() => deleteTransaction(transaction.id!)}
            onPress={() => editTransaction(transaction)}
          >
            <TransactionListItem transaction={transaction} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TransactionList;
