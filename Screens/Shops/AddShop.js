import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import ComonStyles from "../../utils/CommonCss";
import CustomButton from "../../utils/CommonButton";
import React, { useState } from "react";
import HostName from "../../utils/HostName";
import AsyncStorage from '@react-native-async-storage/async-storage';


const AddShop = () => {
  const [shopName, setShopName] = useState(null);
  const [area, setArea] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [number, setNumber] = useState(null);
  const [cnic, setCnic] = useState(null);

  const submitShopData = async (event) => {
    event.preventDefault();
    const shopName1 = shopName;
    const registration1 = registration;
    const ownerPhoneNo = number;
    const ownerCnic = cnic;
    const area1 = area;
    if (
      shopName1 === "" ||
      registration1.length <= 5 ||
      ownerPhoneNo.length <= 10 ||
      ownerCnic === null ||
      area1 === ""
    ) {
      Alert.alert("Failure", "Please fill form completely");
    } else {
      const formData = { shopName: shopName1,
         registration: registration1, 
         ownerPhoneNo, 
         ownerCnic, 
         area: area1 };

      console.log(shopName1);

      try {
        // push(shopsDataRef, formData);
        const jwtToken = await AsyncStorage.getItem("jwtToken");
        const response = await fetch(`${HostName}shops/add-shop`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${jwtToken}`
          },
          method: "PUT",
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (data.shop) {
          setShopName("");
          setArea("");
          setRegistration("");
          setNumber(null);
          setCnic(null);
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
        <View style={styles.background}>
          <Text style={styles.heading1}>Add New Shop</Text>
        </View>
        <View style={styles.background}>
          <TextInput
            placeholder="Shop Name"
            style={ComonStyles.inputStyle1}
            value={shopName}
            inputMode="text"
            onChangeText={(newValue) => setShopName(newValue)}
            required
          />
          <TextInput
            placeholder="Shop Registration (min 5 digits)"
            style={ComonStyles.inputStyle1}
            value={registration}
            inputMode="numeric"
            onChangeText={(newValue) => setRegistration(newValue)}
            required
          />
          <TextInput
            placeholder="Owner Phone No (min 10 digits)"
            style={ComonStyles.inputStyle1}
            value={number}
            inputMode="numeric"
            onChangeText={(newValue) => setNumber(newValue)}
            required
          />
          <TextInput
            placeholder="Owner Identity No."
            style={ComonStyles.inputStyle1}
            value={cnic}
            inputMode="numeric"
            onChangeText={(newValue) => setCnic(newValue)}
            required
          />
          <TextInput
            placeholder="Shop Area"
            style={ComonStyles.inputStyle1}
            value={area}
            inputMode="text"
            onChangeText={(newValue) => setArea(newValue)}
            required
          />
          <CustomButton
            title={"Add Shop"}
            color={"#000"}
            style={{ width: "80%", borderRadius: 10, margin: 10 }}
            handleOnPress={submitShopData}
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
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    backgroundColor: "#fff",
    width: "95%",
    borderRadius: 10,
    boxShadow: "5px 5px",
    elevation: 20,
    shadowColor: "#777777bb",
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    // justifyContent: 'center',
  },
  heading1: {
    fontSize: 30,
    fontWeight: 600,
  },
  text: {
    fontSize: 10,
    color: "#000",
  },
  text15: {
    fontSize: 15,
    color: "#000",
  },
  button: {
    margin: 10,
  },
});

export default AddShop;
