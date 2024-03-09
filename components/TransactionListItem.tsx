import { AntDesign } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";
import { categoryColors, categoryEmojies } from "../model/constants";
import Card from "./ui/Card";
import {
  FiananceAsset,
  FiananceCategory,
  FiananceTransaction,
} from "../model/types";

interface TransactionListItemProps {
  transaction: FiananceTransaction;
  categoryInfo: FiananceCategory | undefined;
  toAsset: FiananceAsset | undefined;
  fromAsset: FiananceAsset | undefined;
}

export default function TransactionListItem({
  transaction,
  categoryInfo,
  toAsset,
  fromAsset,
}: TransactionListItemProps) {
  const iconName =
    transaction.type === "Expense"
      ? "minuscircle"
      : transaction.type === "Income"
      ? "pluscircle"
      : undefined;
  const color = transaction.type === "Expense" ? "red" : "green";
  const categoryColor = categoryColors[categoryInfo?.name ?? "Default"];
  const emoji = categoryEmojies[categoryInfo?.name ?? "Default"];
  return (
    <Card>
      <View style={styles.row}>
        <View style={{ width: "40%", gap: 3 }}>
          <Amount
            amount={transaction.amount}
            color={color}
            iconName={iconName}
          />
          <CategoryItem
            categoryColor={categoryColor}
            categoryInfo={categoryInfo}
            emoji={emoji}
          />
        </View>
        <TransactionInfo
          date={transaction.date}
          description={transaction.description}
          name={transaction.name}
          toAsset={toAsset}
          fromAsset={fromAsset}
        />
      </View>
    </Card>
  );
}

function TransactionInfo({
  name,
  date,
  description,
  fromAsset,
  toAsset,
}: {
  name: string;
  date: number;
  description: string;
  fromAsset: FiananceAsset | undefined;
  toAsset: FiananceAsset | undefined;
}) {
  return (
    <View style={{ flexGrow: 1, gap: 6, flexShrink: 1 }}>
      <Text style={{ fontSize: 16, fontWeight: "bold" }}>{name}</Text>
      <Text>{description}</Text>
      <Text style={{ fontSize: 12, color: "gray" }}>
        {new Date(date * 1000).toDateString()}
      </Text>
      <Text>
        {(fromAsset ? fromAsset.name : "") +
          (fromAsset && toAsset ? " -> " : "") +
          (toAsset ? toAsset.name : "")}
      </Text>
    </View>
  );
}

function CategoryItem({
  categoryColor,
  categoryInfo,
  emoji,
}: {
  categoryColor: string;
  categoryInfo: FiananceCategory | undefined;
  emoji: string;
}) {
  return (
    <View
      style={[
        styles.categoryContainer,
        { backgroundColor: categoryColor + "40" },
      ]}
    >
      <Text style={styles.categoryText}>
        {emoji} {categoryInfo?.name}
      </Text>
    </View>
  );
}

function Amount({
  iconName,
  color,
  amount,
}: {
  iconName: "minuscircle" | "pluscircle" | undefined;
  color: string;
  amount: number;
}) {
  return (
    <View style={styles.row}>
      {iconName && <AntDesign name={iconName} size={18} color={color} />}
      <AutoSizeText
        fontSize={32}
        mode={ResizeTextMode.max_lines}
        numberOfLines={1}
        style={[styles.amount, { maxWidth: "80%" }]}
      >
        ₹{amount}
      </AutoSizeText>
    </View>
  );
}

const styles = StyleSheet.create({
  amount: {
    fontSize: 32,
    fontWeight: "800",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  categoryContainer: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  categoryText: {
    fontSize: 12,
  },
});
