import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import React, { useState } from "react";
import ComonStyles from "../../utils/CommonCss";
import CustomButton from "../../utils/CommonButton";
import HostName from "../../utils/HostName";
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddStocks = ({ navigation }) => {
  const [product, SetProduct] = useState("");
  const [productID, SetProductID] = useState("");
  const [price, setPrice] = useState(0);

  const submitStockData = async (event) => {
    event.preventDefault();
    const productName = product;
    const productId = productID;
    if (productName === "" || productId === "" || price === 0) {
      Alert.alert("Failure", "Please fill form completely");
    }
    else {
      const formData = { productId, productName, price };
      try {
        const jwtToken = await AsyncStorage.getItem("jwtToken");
        const response = await fetch(`${HostName}products/add-product`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${jwtToken}`
          },
          method: "PUT",
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (data.product) {
          SetProduct("");
          SetProductID("");
          setPrice(0);
          Alert.alert("Success", `${data.message}`);
        }
      } catch (error) {
        Alert.alert("Failed!", `${error.message}`);
        console.log(error);
      }
    }
  };

  return (
    <ScrollView>
      <View style={styles.body}>
        <View style={styles.flatlist}>
          <View style={styles.headingFlatlist}>
            <Text style={styles.head}>Add Stock</Text>
          </View>
          <TextInput
            placeholder="Product Name"
            style={ComonStyles.inputStyle1}
            value={product}
            inputMode="text"
            onChangeText={(newValue) => SetProduct(newValue)}
          />
          <TextInput
            placeholder="Product ID"
            style={ComonStyles.inputStyle1}
            value={productID}
            inputMode="text"
            onChangeText={(newValue) => SetProductID(newValue)}
          />
          <TextInput
            placeholder="Price"
            style={ComonStyles.inputStyle1}
            value={price}
            inputMode="numeric"
            onChangeText={(newValue) => setPrice(newValue)}
          />
          <CustomButton
            title={"Add Product"}
            color={"#000"}
            style={{ width: "80%", borderRadius: 10, margin: 10 }}
            handleOnPress={submitStockData}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  flatlist: {
    backgroundColor: "#fff",
    width: "95%",
    borderRadius: 10,
    boxShadow: "5px 5px",
    elevation: 20,
    shadowColor: "#777777bb",
    margin: 5,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  headingFlatlist: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  head: {
    fontSize: 20,
    fontWeight: 600,
  },
});

export default AddStocks;
