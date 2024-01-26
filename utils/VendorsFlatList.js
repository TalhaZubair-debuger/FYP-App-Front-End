import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

const VendorsFlatList = ({ title, id, navigation }) => {
  const navigateToIndividualVendor = () => {
    navigation.navigate("Individual Vendor", {vendorId: id});
  };
  return (
    <TouchableOpacity onPress={navigateToIndividualVendor}>
      <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'center',
    alignItems: "center",
    width: "100%",
    borderRadius: 10,
    boxShadow: "5px 5px #777777bb",
    backgroundColor: "#dddddd55",
    marginBottom: 5,
    height: 60,
  },
  title: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    textAlign: "center",
    fontSize: 30,
  },
  products: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    marginTop: 5,
  },
});
export default VendorsFlatList;
