import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { AddButton, CategoryOrAssetButton } from "./AddTransaction";
import Card from "./ui/Card";
import { FinanceAssetGroup } from "../entities/FinanceAssetGroup";
import { FinanceAsset } from "../entities/FinanceAsset";

const AddAsset = ({
  assetGroups,
  insertAsset,
}: {
  assetGroups: FinanceAssetGroup[];
  insertAsset(asset: FinanceAsset): Promise<void>;
}) => {
  const [isAddingAsset, setIsAddingAsset] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [selectedGrpId, setSelectedGrpId] = useState<number>(0);
  const [selectedGrpName, setSelectedGrpName] = useState<string>("");

  const handleSave = () => {
    if (!name || !selectedGrpId) {
      console.log("Please select a name and Asset Group");
      return;
    }

    insertAsset({
      name,
      assetGroup: assetGroups.find((grp) => grp.id === selectedGrpId),
      isDeleted: false,
      settlementDay: undefined,
      id: -1,
      paymentDay: undefined,
    });
    setIsAddingAsset(false);
    resetAsset();
  };

  const resetAsset = () => {
    setName("");
    setSelectedGrpId(0);
    setSelectedGrpName("");
  };

  return (
    <View>
      <Modal
        animationType="slide"
        visible={isAddingAsset}
        transparent={true}
        onRequestClose={() => setIsAddingAsset(false)}
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
              <Text style={{ marginBottom: 6 }}>Select a Asset Group</Text>
              {assetGroups.map((assetGrp) => (
                <CategoryOrAssetButton
                  key={assetGrp.name}
                  id={assetGrp.id}
                  title={assetGrp.name}
                  isSelected={selectedGrpId === assetGrp.id}
                  setTypeSelected={setSelectedGrpName}
                  setCategoryId={setSelectedGrpId}
                />
              ))}
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
                    //removeTransaction();
                    setIsAddingAsset(false);
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
          resetAsset();
          console.log("Removed");
          setIsAddingAsset(value);
        }}
      />
    </View>
  );
};

export default AddAsset;

const styles = StyleSheet.create({});
