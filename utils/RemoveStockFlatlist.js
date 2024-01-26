import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import HostName from './HostName';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RemoveStockFlatList = ({ id, title, navigation }) => {
  const navigateToProduct = () => {
    navigation.navigate("Stock", { id });
  }
  const handleDeleteProduct = async() => {
    try {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      const response = await fetch(`${HostName}products/delete-product/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${jwtToken}`
        },
        method: "DELETE"
      })
      const Data = await response.json();
      Alert.alert("Success", `${Data.message}`);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Failure", "Failed to delete product."
      );
    }
  }

  return (
    <View style={styles.item}>
      <Pressable style={styles.title} onPress={navigateToProduct}>
        <Text style={styles.font15} >{title}</Text>
      </Pressable>
      <Text style={styles.purchase}>
        <View style={styles.fontawesome}>
          <Pressable onPress={handleDeleteProduct}>
            <Text style={styles.innerFonts}>
              <FontAwesome5 name={"trash-alt"} size={20} color={"#ff0000"} />
            </Text>
          </Pressable>
        </View>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "flex-start", // Aligns the boxes to the top right corner
  },
  bold: {
    fontWeight: "600"
  },
  flatlist: {
    backgroundColor: "#fff",
    width: "95%",
    borderRadius: 10,
    boxShadow: "5px 5px",
    elevation: 20,
    shadowColor: "#777777bb",
    padding: 5,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  headingFlatlist: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    margin: 10,
  },
  font15: {
    fontSize: 15
  },
  item: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderRadius: 10,
    boxShadow: "5px 5px #777777bb",
    backgroundColor: "#dddddd55",
    marginBottom: 5,
    height: 60,
  },
  title: {
    fontSize: 20,
    flex: 1,
    justifyContent: "center",
    textAlign: "left",
    maxWidth: 150,
    borderRightColor: "#aaa",
    borderRightWidth: 2,
    marginLeft: 5,
  },
  purchase: {
    flex: 1,
    justifyContent: "center",
    fontSize: 20,
    textAlign: "right",
    marginRight: 5,
  },
  color: {
    fontSize: 20,
    color: "#00FF00",
  },
  fontawesome: {
    margin: 5,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  innerFonts: {
    margin: 10,
  },
});
export default RemoveStockFlatList;
