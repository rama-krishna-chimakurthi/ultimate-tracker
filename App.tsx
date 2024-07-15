import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Suspense, useEffect, useState } from "react";
import Home from "./screens/Home";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Passwords from "./screens/PasswordsScreen";

import { MaterialIcons } from "@expo/vector-icons";

import "reflect-metadata";
import { dataSource } from "./services/DataService";
import AssetsScreen from "./screens/AssetsScreen";
import CategoriesScreen from "./screens/CategoriesScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Stack = createNativeStackNavigator();

const topTabs = createMaterialTopTabNavigator();
const bottomTabs = createBottomTabNavigator();

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
    </topTabs.Navigator>
  );
};

const BottomTabsNavigator = () => {
  return (
    <bottomTabs.Navigator
      screenOptions={{
        lazy: true,
      }}
    >
      <bottomTabs.Screen
        name="Finance"
        component={TopTabsNavigator}
        options={{
          headerTitle: "Finance Tracker",
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="currency-rupee"
              size={26}
              color={focused ? "black" : "gray"}
            />
          ),
        }}
      />
      <bottomTabs.Screen
        name="Password"
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="password"
              size={26}
              color={focused ? "black" : "gray"}
            />
          ),
        }}
        component={Passwords}
      />
    </bottomTabs.Navigator>
  );
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
        {/* <Stack.Navigator>
          <Stack.Screen
            name="main"
            component={BottomTabsNavigator}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator> */}

        <BottomTabsNavigator />
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
