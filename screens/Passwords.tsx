import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { dataSource } from "../services/DataService";

const Passwords = () => {
  useEffect(() => {
    const connect = async () => {
      await dataSource.initialize();
    };

    connect();
  }, []);

  return (
    <View>
      <Text>Passwords</Text>
    </View>
  );
};

export default Passwords;
