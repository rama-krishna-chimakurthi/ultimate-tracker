import { AntDesign } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";
import { categoryColors, categoryEmojies } from "../model/constants";
import Card from "./ui/Card";
import { FinanceTransaction } from "../entities/FinanceTransaction";
import { FinanceAsset } from "../entities/FinanceAsset";
import { FinanceCategory } from "../entities/FinanceCategory";

interface TransactionListItemProps {
  transaction: FinanceTransaction;
}

export default function TransactionListItem({
  transaction,
}: TransactionListItemProps) {
  const iconName =
    transaction.type === "Expense"
      ? "minuscircle"
      : transaction.type === "Income"
      ? "pluscircle"
      : undefined;
  const color = transaction.type === "Expense" ? "red" : "green";
  const categoryColor = categoryColors[transaction.category.name ?? "Default"];
  const emoji = categoryEmojies[transaction.category?.name ?? "Default"];
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
            categoryInfo={transaction.category}
            emoji={emoji}
          />
        </View>
        <TransactionInfo
          date={transaction.transactionDate}
          description={transaction.description}
          name={transaction.name}
          toAsset={transaction.toAsset}
          fromAsset={transaction.fromAsset}
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
  date: Date;
  description: string;
  fromAsset: FinanceAsset | undefined;
  toAsset: FinanceAsset | undefined;
}) {
  return (
    <View style={{ flexGrow: 1, gap: 6, flexShrink: 1 }}>
      <Text style={{ fontSize: 16, fontWeight: "bold" }}>{name}</Text>
      <Text>{description}</Text>
      <Text style={{ fontSize: 12, color: "gray" }}>{date.toDateString()}</Text>
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
  categoryInfo: FinanceCategory | undefined;
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

export const Amount = ({
  iconName,
  color,
  amount,
}: {
  iconName: "minuscircle" | "pluscircle" | undefined;
  color: string;
  amount: number;
}) => {
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
};

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
