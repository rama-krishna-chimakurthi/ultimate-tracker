import {
  View,
  Text,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { dataSource } from "../services/DataService";
import { PasswordEntity } from "../entities/PasswordEntity";
import Card from "../components/ui/Card";
import { AddButton, CategoryOrAssetButton } from "../components/AddTransaction";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useIsFocused } from "@react-navigation/native";

const Passwords = () => {
  const [passwordEntries, setPasswordEntries] = useState<PasswordEntity[]>([]);
  const [editPasswordEntry, setEditPasswordEntry] = useState<
    PasswordEntity | undefined
  >(undefined);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    getData();
  }, [isFocused]);

  const getData = async () => {
    const result = await dataSource.getRepository(PasswordEntity).find();
    console.log(result);
    setPasswordEntries(result);
  };

  const deletePassword = async (id: number) => {
    await dataSource.getRepository(PasswordEntity).delete(id);
    getData();
  };

  return (
    <View style={{ padding: 15, gap: 15 }}>
      <AddPassword
        passwordEntry={editPasswordEntry}
        removePassword={() => {
          setEditPasswordEntry(undefined);
          console.log("removed editPasswordEntry");
          getData();
        }}
      />
      <PasswordListItem
        passwordEntries={passwordEntries}
        deletePasswordEntry={deletePassword}
        editPasswordEntry={setEditPasswordEntry}
      />
    </View>
  );
};

export default Passwords;

const PasswordListItem = ({
  passwordEntries,
  deletePasswordEntry,
  editPasswordEntry,
}: {
  passwordEntries: PasswordEntity[];
  deletePasswordEntry: (id: number) => void;
  editPasswordEntry: (passwordEntry: PasswordEntity) => void;
}) => {
  const [showPassword, setShowPassword] = useState<number | undefined>(
    undefined
  );
  return (
    <View style={{ gap: 15 }}>
      {passwordEntries.map((passwordEntry) => {
        return (
          <TouchableOpacity
            key={passwordEntry.id}
            activeOpacity={0.7}
            onLongPress={() => deletePasswordEntry(passwordEntry.id!)}
            onPress={() => editPasswordEntry(passwordEntry)}
          >
            <Card
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <View style={{ alignSelf: "center" }}>
                <Image
                  style={{ width: 40, height: 40 }}
                  source={{
                    uri:
                      "https://www.google.com/s2/favicons?domain=" +
                      passwordEntry.website,
                  }}
                />
              </View>
              <View>
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", paddingBottom: 5 }}
                >
                  {passwordEntry.name}
                </Text>

                {passwordEntry.email && (
                  <Text>Email - {passwordEntry.email}</Text>
                )}
                {passwordEntry.userName && (
                  <Text>Username - {passwordEntry.userName}</Text>
                )}
                <Text>Website - {passwordEntry.website}</Text>
                <Text>
                  Expires On - {passwordEntry.expiringOn.toDateString()}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Text>
                      Password -{" "}
                      {showPassword === passwordEntry.id
                        ? passwordEntry.password
                        : "xxxxxxx"}
                    </Text>
                  </View>
                  <View style={{ justifyContent: "center" }}>
                    <Pressable
                      onPress={() =>
                        showPassword === passwordEntry.id
                          ? setShowPassword(undefined)
                          : setShowPassword(passwordEntry.id)
                      }
                    >
                      <Ionicons
                        name={
                          showPassword === passwordEntry.id ? "eye" : "eye-off"
                        }
                        size={35}
                        color="black"
                      />
                    </Pressable>
                  </View>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const AddPassword = ({
  passwordEntry,
  removePassword,
}: {
  passwordEntry: PasswordEntity;
  removePassword(): void;
}) => {
  const [isAddingPasswordEntry, setIsAddingPasswordEntry] =
    useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [category, setCategory] = useState<"Bank" | "Social">("Social");
  const [expiringOn, setExpiringOn] = useState<Date>(new Date());
  const [nextReminder, setNextReminder] = useState<Date>(new Date());

  const [isDatePickerVisible, setIsDatePickerVisible] =
    useState<boolean>(false);
  const [isTimePickerVisible, setIsTimePickerVisible] =
    useState<boolean>(false);

  const categories = ["Bank", "Social"];

  const resetPasswordEntry = () => {
    if (passwordEntry) {
      setName(passwordEntry.name);
      setUserName(passwordEntry.userName);
      setEmail(passwordEntry.email);
      setPassword(passwordEntry.password);
      setWebsite(passwordEntry.website);
      setCategory(passwordEntry.category);
      setExpiringOn(passwordEntry.expiringOn);
      setNextReminder(passwordEntry.nextReminder);
      setIsAddingPasswordEntry(true);
      return;
    }
    setName("");
    setUserName("");
    setEmail("");
    setPassword("");
    setWebsite("");
    setCategory("Social");
    setExpiringOn(new Date());
    setNextReminder(new Date());
    setIsAddingPasswordEntry(false);
  };

  useEffect(() => {
    resetPasswordEntry();
  }, [passwordEntry]);

  const onChangeDate = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === "set" && date) {
      setExpiringOn(date);
      setNextReminder(date);
    }
    closeDateTimePicker();
  };

  const closeDateTimePicker = () => {
    setIsDatePickerVisible(false);
    setIsTimePickerVisible(false);
  };

  const validation = () => {
    if (
      !name ||
      !password ||
      !website ||
      !category ||
      !expiringOn ||
      !nextReminder
    ) {
      alert("Please provide required fields.");
      return false;
    }
    if (!userName && !email) {
      alert("Either email or username is required.");
      return false;
    }
    if (
      !userName &&
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
    ) {
      alert("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    validation();
    const newPasswordEntry: PasswordEntity = {
      name,
      userName,
      email,
      password,
      website,
      category,
      expiringOn: expiringOn,
      nextReminder: nextReminder,
      id: passwordEntry?.id || undefined,
      dateCreated: passwordEntry?.dateCreated || undefined,
      lastUpdated: new Date(),
    };
    console.log(newPasswordEntry);
    await dataSource.getRepository(PasswordEntity).save(newPasswordEntry);
    resetPasswordEntry();
    removePassword();
  };

  return (
    <View>
      <Modal
        animationType="slide"
        visible={isAddingPasswordEntry}
        transparent={true}
        onRequestClose={() => {
          setIsAddingPasswordEntry(false);
          removePassword();
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
        >
          <Card style={{ maxHeight: 500 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TextInput
                placeholder="Name"
                value={name}
                style={{ fontSize: 32, marginBottom: 15, fontWeight: "bold" }}
                onChangeText={setName}
              />
              <TextInput
                placeholder="Username"
                value={userName}
                style={{ fontSize: 15, marginBottom: 15, fontWeight: "bold" }}
                onChangeText={setUserName}
              />
              <TextInput
                placeholder="Email"
                value={email}
                style={{ fontSize: 15, marginBottom: 15, fontWeight: "bold" }}
                onChangeText={setEmail}
              />
              <TextInput
                placeholder="Password"
                value={password}
                textContentType="password"
                secureTextEntry
                style={{ fontSize: 15, marginBottom: 15, fontWeight: "bold" }}
                onChangeText={setPassword}
              />
              <TextInput
                placeholder="Website URL"
                value={website}
                textContentType="URL"
                style={{ fontSize: 15, marginBottom: 15, fontWeight: "bold" }}
                onChangeText={setWebsite}
              />
              <Text style={{ marginBottom: 6 }}>Select a Category</Text>
              {categories.map((cat, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setCategory(cat as "Bank" | "Social");
                  }}
                  activeOpacity={0.6}
                  style={{
                    height: 40,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                      cat === category ? "#007BFF20" : "#00000020",
                    borderRadius: 15,
                    marginBottom: 6,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "700",
                      color: cat === category ? "#007BFF" : "#000000",
                      marginLeft: 5,
                    }}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}

              <Text style={{ marginBottom: 6 }}>Select Expiration Date</Text>
              <View
                style={{ flexDirection: "row", gap: 10, paddingBottom: 10 }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setIsDatePickerVisible(true);
                  }}
                >
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    {expiringOn.toLocaleDateString("default", {
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
                    {expiringOn.toLocaleTimeString("default", {
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </Text>
                </TouchableOpacity>
              </View>
              {isDatePickerVisible && (
                <DateTimePicker
                  mode="date"
                  minimumDate={new Date()}
                  value={expiringOn}
                  onChange={onChangeDate}
                />
              )}
              {isTimePickerVisible && (
                <DateTimePicker
                  mode="time"
                  minimumDate={new Date()}
                  value={expiringOn}
                  onChange={onChangeDate}
                />
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
                    removePassword();
                    setIsAddingPasswordEntry(false);
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
            </ScrollView>
          </Card>
        </View>
      </Modal>
      <AddButton
        setIsAddingTransaction={(value) => {
          resetPasswordEntry();
          console.log("Removed");
          setIsAddingPasswordEntry(value);
        }}
      />
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
