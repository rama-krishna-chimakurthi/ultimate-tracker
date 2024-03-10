import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite/next";
import { SumOfTransactionsByMonth } from "../model/types";
import { VictoryPie } from "victory-native";

const CategoriesScreen = () => {
  const [categorysSummary, setCategoriesSummary] = useState<
    SumOfTransactionsByMonth[]
  >([]);
  const [data, setData] = useState<{ x: string; y: number }[]>([]);

  const query = `
  SELECT 
    finance_categories.name, finance_categories.id,
      COALESCE(SUM(CASE WHEN finance_transactions.type = 'Expense' THEN amount ELSE 0 END), 0) AS totalExpenses,
      COALESCE(SUM(CASE WHEN finance_transactions.type = 'Income' THEN amount ELSE 0 END), 0) AS totalIncome
  FROM finance_transactions
  JOIN finance_categories
  ON finance_categories.id = finance_transactions.category_id
  WHERE finance_transactions.date >= ? AND finance_transactions.date <= ?
  GROUP BY finance_categories.name`;

  const db = useSQLiteContext();

  useEffect(() => {
    db.withTransactionAsync(async () => {
      await getData();
    });
  }, [db]);

  const getData = async () => {
    const now = new Date();
    // Set to the first day of the current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    // Get the first day of the next month, then subtract one millisecond to get the end of the current month
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    endOfMonth.setMilliseconds(endOfMonth.getMilliseconds() - 1);

    // Convert to Unix timestamps (seconds)
    const startOfMonthTimestamp = Math.floor(startOfMonth.getTime() / 1000);
    const endOfMonthTimestamp = Math.floor(endOfMonth.getTime() / 1000);

    const result = await db.getAllAsync<SumOfTransactionsByMonth>(query, [
      startOfMonthTimestamp,
      endOfMonthTimestamp,
    ]);

    console.log(result);
    setCategoriesSummary(result);

    setData([]);
    const dataTemp: { x: string; y: number }[] = [];
    result.forEach((category) => {
      dataTemp.push({
        x: category.name,
        y: category.totalIncome + category.totalExpenses,
      });
    });
    console.log(dataTemp);
    setData(dataTemp);
    console.log(data);
  };

  return (
    <View>
      <Text>CategoriesScreen</Text>
      <VictoryPie data={data} />
    </View>
  );
};

export default CategoriesScreen;
