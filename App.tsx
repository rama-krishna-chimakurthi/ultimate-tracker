import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import { Suspense, useEffect, useState } from "react";
import { SQLiteProvider } from "expo-sqlite/next";
import Home from "./screens/Home";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AssetsScreen from "./screens/AssetsScreen";
import CategoriesScreen from "./screens/CategoriesScreen";

const dbName = "ultimate-tracker.db";
const Stack = createNativeStackNavigator();

const topTabs = createMaterialTopTabNavigator();

const TopTabsNavigator = () => {
  return (
    <topTabs.Navigator>
      <topTabs.Screen name="Home" component={Home} />
      <topTabs.Screen name="Assets" component={AssetsScreen} />
      <topTabs.Screen name="Categories" component={CategoriesScreen} />
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
    loadDatabase()
      .then(() => setDbLoaded(true))
      .catch((e) => console.error(e));
  }, []);

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
        <SQLiteProvider databaseName={dbName} useSuspense>
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
        </SQLiteProvider>
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
