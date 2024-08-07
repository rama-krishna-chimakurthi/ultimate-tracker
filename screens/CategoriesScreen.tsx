import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";

import { SumOfTransactionsByMonth } from "../model/types";
import { VictoryPie } from "victory-native";
import Card from "../components/ui/Card";
import { useIsFocused } from "@react-navigation/native";
import { dataSource } from "../services/DataService";
import { FinanceTransaction } from "../entities/FinanceTransaction";

const CategoriesScreen = () => {
  const [categorysSummary, setCategoriesSummary] = useState<
    SumOfTransactionsByMonth[]
  >([]);
  const [dataExpenses, setDataExpense] = useState<{ x: string; y: number }[]>(
    []
  );
  const [dataIncomes, setDataIncome] = useState<{ x: string; y: number }[]>([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    //db.withTransactionAsync(async () => {
    getData();
    //});
  }, [isFocused]);

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

    const queryRunner = dataSource.createQueryRunner();

    const query = `
      SELECT
        finance_categories.name, finance_categories.id,
          COALESCE(SUM(CASE WHEN finance_transactions.type = 'Expense' THEN amount ELSE 0 END), 0) AS totalExpenses,
          COALESCE(SUM(CASE WHEN finance_transactions.type = 'Income' THEN amount ELSE 0 END), 0) AS totalIncome
      FROM finance_transactions
      JOIN finance_categories
      ON finance_categories.id = finance_transactions.category_id
      WHERE finance_transactions.transaction_date >= ? AND finance_transactions.transaction_date <= ?
      GROUP BY finance_categories.name
    `;

    const result: SumOfTransactionsByMonth[] = await dataSource
      .getRepository(FinanceTransaction)
      .createQueryBuilder("finance_transactions")
      .select([
        "finance_categories.name as name",
        "finance_categories.id as id",
        "COALESCE(SUM(CASE WHEN finance_transactions.type = 'Expense' THEN amount ELSE 0 END), 0) AS totalExpenses",
        "COALESCE(SUM(CASE WHEN finance_transactions.type = 'Income' THEN amount ELSE 0 END), 0) AS totalIncome",
      ])
      .innerJoinAndSelect("finance_transactions.category", "finance_categories")
      .where(
        "finance_transactions.transaction_date >= :fromDate AND finance_transactions.transaction_date <= :endDate",
        { endDate: endOfMonth, fromDate: startOfMonth }
      )
      .groupBy("finance_categories.name")
      .execute();

    /* queryRunner.query(query, [
      startOfMonthTimestamp,
      endOfMonthTimestamp,
    ]); */

    console.log(result);
    setCategoriesSummary(result);

    setDataExpense([]);
    setDataIncome([]);
    let dataTemp: { x: string; y: number }[] = [];
    result
      .filter((cat) => cat.totalExpenses === 0)
      .forEach((category) => {
        dataTemp.push({
          x: category.name,
          y: category.totalIncome + category.totalExpenses,
        });
      });
    console.log(dataTemp);
    setDataIncome(dataTemp);
    console.log(dataIncomes);

    dataTemp = [];
    result
      .filter((cat) => cat.totalIncome === 0)
      .forEach((category) => {
        dataTemp.push({
          x: category.name,
          y: category.totalIncome + category.totalExpenses,
        });
      });
    console.log(dataTemp);
    setDataExpense(dataTemp);
    console.log(dataIncomes);
  };

  return (
    <View>
      <ScrollView>
        <Card style={{ margin: 20, justifyContent: "center" }}>
          <Text>Income</Text>
          <View style={{ marginLeft: -20 }}>
            <VictoryPie data={dataIncomes} height={300} />
          </View>
        </Card>
        <Card style={{ margin: 20, justifyContent: "center" }}>
          <Text>Expenses</Text>
          <View style={{ marginLeft: -20 }}>
            <VictoryPie data={dataExpenses} height={300} />
          </View>
        </Card>
      </ScrollView>
    </View>
  );
};

export default CategoriesScreen;
