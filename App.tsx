import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import { Suspense, useEffect, useState } from "react";
//import { SQLiteProvider } from "expo-sqlite/next";
import Home from "./screens/Home";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
/* import AssetsScreen from "./screens/AssetsScreen";
import CategoriesScreen from "./screens/CategoriesScreen"; */
import Passwords from "./screens/Passwords";

import "reflect-metadata";
import { dataSource } from "./services/DataService";
import AssetsScreen from "./screens/AssetsScreen";
import CategoriesScreen from "./screens/CategoriesScreen";

const dbName = "ultimate-tracker.db";
const Stack = createNativeStackNavigator();

const topTabs = createMaterialTopTabNavigator();

const TopTabsNavigator = () => {
  return (
    <topTabs.Navigator
      screenOptions={{
        lazy: true,
      }}
    >
      <topTabs.Screen name="Home" component={Home} />
      <topTabs.Screen name="Assets" component={AssetsScreen} />
      <topTabs.Screen name="Categories" component={CategoriesScreen} />
      <topTabs.Screen name="Password" component={Passwords} />
    </topTabs.Navigator>
  );
};

const loadDatabase = async () => {
  const dbAsset = require(`./assets/${dbName}`);
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}SQLite`,
      { intermediates: true }
    );
    await FileSystem.downloadAsync(dbUri, dbFilePath);
  }
};

export default function App() {
  const [dbLoaded, setDbLoaded] = useState<boolean>(false);

  useEffect(() => {
    const connect = async () => {
      await dataSource
        .initialize()
        .then(() => {
          console.log("Database connected successfully");
          setDbLoaded(true);
        })
        .catch((e) => console.error(e));
    };
    connect();
  }, []);

  /* useEffect(() => {
    loadDatabase()
      .then(() => setDbLoaded(true))
      .catch((e) => console.error(e));
  }, []); */

  if (!dbLoaded)
    return (
      <View style={{ flex: 1 }}>
        <ActivityIndicator size={"large"} />
        <Text>Loading Database...</Text>
      </View>
    );

  return (
    <NavigationContainer>
      <Suspense
        fallback={
          <View style={{ flex: 1 }}>
            <ActivityIndicator size={"large"} />
            <Text>Loading Database...</Text>
          </View>
        }
      >
        <Stack.Navigator>
          <Stack.Screen
            name="main"
            component={TopTabsNavigator}
            options={{
              headerTitle: "Finance Tracker",
              headerLargeTitle: true,
            }}
          />
        </Stack.Navigator>
      </Suspense>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
