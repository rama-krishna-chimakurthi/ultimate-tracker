import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Card from "./ui/Card";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useSQLiteContext } from "expo-sqlite/next";
import {
  FiananceAsset,
  FiananceCategory,
  FiananceTransaction,
} from "../model/types";
import { categoryTableName } from "../model/constants";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

const transactionTypes = ["Expense", "Income", "Transfer"];

export default function AddTransaction({
  assets,
  transaction,
  insertTransaction,
  removeTransaction,
}: {
  assets: FiananceAsset[];
  transaction: FiananceTransaction | undefined;
  insertTransaction(transaction: FiananceTransaction): Promise<void>;
  removeTransaction(): void;
}) {
  const [isAddingTransaction, setIsAddingTransaction] =
    useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [categories, setCategories] = useState<FiananceCategory[]>([]);

  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [name, setName] = useState<string>("");

  /* Category */
  const [categorySelected, setCategorySelected] = useState<string>("");
  const [categoryId, setCategoryId] = useState<number>(0);

  /* From Asset */
  const [fromAssetSelected, setFromAssetSelected] = useState<string>("");
  const [fromAssetId, setFromAssetId] = useState<number>(0);

  /* To Asset */
  const [toAssetSelected, setToAssetSelected] = useState<string>("");
  const [toAssetId, setToAssetId] = useState<number>(0);

  /* Date */
  const [date, setDate] = useState<Date>(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] =
    useState<boolean>(false);
  const [isTimePickerVisible, setIsTimePickerVisible] =
    useState<boolean>(false);

  const [typeOfTransaction, setTypeOfTransaction] = useState<string>("Expense");

  const db = useSQLiteContext();

  useEffect(() => {
    getExpenseType(currentTab);
  }, [currentTab]);

  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount.toString());
      setDescription(transaction.description);
      setName(transaction.name);
      setCategoryId(transaction.category_id);
      if (transaction.from_asset) setFromAssetId(transaction.from_asset);
      if (transaction.to_asset) setToAssetId(transaction.to_asset);
      setDate(new Date(transaction.date * 1000));
      setTypeOfTransaction(transaction.type);
      setIsAddingTransaction(true);
    } else {
      resetTransaction();
    }
  }, [transaction]);

  async function getExpenseType(currentTab: number) {
    const type = transactionTypes[currentTab];
    setTypeOfTransaction(type);
    setCategorySelected("");

    if (currentTab < 2) {
      const result = await db.getAllAsync<FiananceCategory>(
        `SELECT * FROM ${categoryTableName} WHERE type = ?;`,
        [type]
      );
      setCategories(result);
    } else {
      setCategories([]);
    }
  }

  const resetTransaction = () => {
    setAmount("");
    setDescription("");
    setName("");
    setTypeOfTransaction("Expense");
    setCategoryId(1);
    setCurrentTab(0);
    setIsAddingTransaction(false);
    setFromAssetSelected("");
    setFromAssetId(0);
    setToAssetSelected("");
    setToAssetId(0);
    setDate(new Date());
    setIsDatePickerVisible(false);
    setIsTimePickerVisible(false);
    setCategorySelected("");
    setCategoryId(0);
  };

  async function handleSave() {
    console.log({
      amount: Number(amount),
      description,
      category_id: categoryId,
      date: new Date().getTime() / 1000,
      type: typeOfTransaction as "Expense" | "Income",
    });

    switch (typeOfTransaction) {
      case "Expense":
        if (fromAssetId < 0 || toAssetId >= 0) {
          console.log(
            "invalid Expense. From asset should not be empty. To asset should be empty"
          );
          return;
        }
        break;
      case "Income":
        if (fromAssetId >= 0 || toAssetId < 0) {
          console.log(
            "invalid Expense. From asset should be empty. To asset should not be empty"
          );
          return;
        }
        break;
      case "Transfer":
        if (fromAssetId < 0 || toAssetId < 0) {
          console.log(
            "invalid Expense. From asset should not be empty. To asset should not be empty"
          );
          return;
        }
        break;
    }
    if (!amount || !date || categoryId > 0) {
      console.log("Invalid amount or category or date is invalid.");
      return;
    }

    // @ts-ignore
    await insertTransaction({
      amount: Number(amount),
      description,
      category_id: categoryId,
      date: date.getTime() / 1000,
      type: typeOfTransaction as "Expense" | "Income" | "Transfer",
      name,
      from_asset: fromAssetId,
      to_asset: toAssetId,
      id: transaction?.id ? transaction.id : -1,
    });
    resetTransaction();
  }

  const closeDateTimePicker = () => {
    setIsDatePickerVisible(false);
    setIsTimePickerVisible(false);
  };

  const onChangeDate = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === "set" && date) {
      setDate(date);
    }
    closeDateTimePicker();
  };

  return (
    <View style={{ marginBottom: 15 }}>
      <Modal
        animationType="slide"
        visible={isAddingTransaction}
        transparent={true}
        onRequestClose={() => setIsAddingTransaction(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
        >
          <Card>
            <TextInput
              placeholder="₹Amount"
              value={amount}
              style={{ fontSize: 32, marginBottom: 15, fontWeight: "bold" }}
              keyboardType="numeric"
              onChangeText={(text) => {
                // Remove any non-numeric characters before setting the state
                const numericValue = text.replace(/[^0-9.]/g, "");
                setAmount(numericValue);
              }}
            />
            <TextInput
              placeholder="Name"
              value={name}
              style={{ fontSize: 20, marginBottom: 15, fontWeight: "bold" }}
              onChangeText={setName}
            />
            <TextInput
              placeholder="Description"
              value={description}
              style={{ marginBottom: 15 }}
              onChangeText={setDescription}
            />
            <Text style={{ marginBottom: 6 }}>Select Transaction Date</Text>
            <View style={{ flexDirection: "row", gap: 10, paddingBottom: 10 }}>
              <TouchableOpacity
                onPress={() => {
                  setIsDatePickerVisible(true);
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {date.toLocaleDateString("default", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsTimePickerVisible(true);
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {date.toLocaleTimeString("default", {
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </Text>
              </TouchableOpacity>
            </View>
            {isDatePickerVisible && (
              <DateTimePicker
                mode="date"
                maximumDate={new Date()}
                value={date}
                onChange={onChangeDate}
              />
            )}
            {isTimePickerVisible && (
              <DateTimePicker
                mode="time"
                maximumDate={new Date()}
                value={date}
                onChange={onChangeDate}
              />
            )}
            <Text style={{ marginBottom: 6 }}>Select a entry type</Text>
            <SegmentedControl
              values={transactionTypes}
              style={{ marginBottom: 15 }}
              selectedIndex={currentTab}
              onChange={(event) => {
                setCurrentTab(+event.nativeEvent.selectedSegmentIndex);
              }}
            />
            {categories.map((cat) => (
              <CategoryOrAssetButton
                key={cat.name}
                id={cat.id}
                title={cat.name}
                isSelected={categoryId === cat.id}
                setTypeSelected={setCategorySelected}
                setCategoryId={setCategoryId}
              />
            ))}
            {/* From Asset */}
            {(typeOfTransaction === "Transfer" ||
              typeOfTransaction === "Expense") && (
              <View>
                <Text style={{ marginBottom: 6 }}>Select a From Asset</Text>
                {assets.map((asset) => (
                  <CategoryOrAssetButton
                    key={asset.name}
                    id={asset.id}
                    title={asset.name}
                    isSelected={fromAssetId === asset.id}
                    setTypeSelected={setFromAssetSelected}
                    setCategoryId={setFromAssetId}
                  />
                ))}
              </View>
            )}
            {/* To Asset */}
            {(typeOfTransaction === "Transfer" ||
              typeOfTransaction === "Income") && (
              <View>
                <Text style={{ marginBottom: 6 }}>Select a To Asset</Text>
                {assets.map((asset) => (
                  <CategoryOrAssetButton
                    key={asset.name}
                    id={asset.id}
                    title={asset.name}
                    isSelected={toAssetId === asset.id}
                    setTypeSelected={setToAssetSelected}
                    setCategoryId={setToAssetId}
                  />
                ))}
              </View>
            )}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                padding: 15,
              }}
            >
              <Pressable
                style={{
                  backgroundColor: "red",
                  minWidth: 150,
                  minHeight: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  removeTransaction();
                  setIsAddingTransaction(false);
                }}
              >
                <Text
                  style={{ fontSize: 15, fontWeight: "bold", color: "white" }}
                >
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                style={{
                  backgroundColor: "#4682B4",
                  minWidth: 150,
                  minHeight: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={handleSave}
              >
                <Text style={{ fontSize: 15, color: "white" }}>Save</Text>
              </Pressable>
            </View>
          </Card>
        </View>
      </Modal>
      <AddButton
        setIsAddingTransaction={(value) => {
          removeTransaction();
          console.log("Renoved");
          setIsAddingTransaction(value);
        }}
      />
    </View>
  );
}

function CategoryOrAssetButton({
  id,
  title,
  isSelected,
  setTypeSelected,
  setCategoryId,
}: {
  id: number;
  title: string;
  isSelected: boolean;
  setTypeSelected: Dispatch<SetStateAction<string>>;
  setCategoryId: Dispatch<SetStateAction<number>>;
}) {
  return (
    <TouchableOpacity
      onPress={() => {
        setTypeSelected(title);
        setCategoryId(id);
      }}
      activeOpacity={0.6}
      style={{
        height: 40,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isSelected ? "#007BFF20" : "#00000020",
        borderRadius: 15,
        marginBottom: 6,
      }}
    >
      <Text
        style={{
          fontWeight: "700",
          color: isSelected ? "#007BFF" : "#000000",
          marginLeft: 5,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

function AddButton({
  setIsAddingTransaction,
}: {
  setIsAddingTransaction: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <TouchableOpacity
      onPress={() => setIsAddingTransaction(true)}
      activeOpacity={0.6}
      style={{
        height: 40,
        flexDirection: "row",
        alignItems: "center",

        justifyContent: "center",
        backgroundColor: "#007BFF20",
        borderRadius: 15,
      }}
    >
      <MaterialIcons name="add-circle-outline" size={24} color="#007BFF" />
      <Text style={{ fontWeight: "700", color: "#007BFF", marginLeft: 5 }}>
        New Entry
      </Text>
    </TouchableOpacity>
  );
}
