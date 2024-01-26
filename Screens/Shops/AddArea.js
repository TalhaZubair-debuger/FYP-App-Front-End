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
// import app from "../../firebaseConfig";
// import { getDatabase, ref, push } from "firebase/database";
import HostName from "../../utils/HostName";
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddArea = () => {
  const [areaName, setAreaName] = useState("");
  const [areaCode, SetAreaCode] = useState("");
  // const db = getDatabase(app);
  // const areasDataRef = ref(db, "Areas");

  const submitShopData = async () => {
    const Id = areaCode;
    if (
      areaName === "" ||
      Id === null
    ) {
      Alert.alert("Failure", "Please fill form completely");
    } else {
      const formData = { areaName, areaCode };
      try {
        // push(areasDataRef, formData);
        const jwtToken = await AsyncStorage.getItem("jwtToken")
        const response = await fetch(`${HostName}shops/add-area`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${jwtToken}`
          },
          method: "PUT",
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (data.userId) {
          setAreaName("");
          SetAreaCode(null);
          Alert.alert("Success", "Area added Successfully!");
        }
      } catch (error) {
        Alert.alert("Failure", "Adding area Failed");
        console.log(error);
      }
    }
  };
  return (
    <ScrollView>
      <View style={styles.body}>
        <View style={styles.background}>
          <Text style={styles.heading1}>Add New Area</Text>
        </View>
        <View style={styles.background}>
          <TextInput
            placeholder="Area Name"
            style={ComonStyles.inputStyle1}
            value={areaName}
            inputMode="text"
            onChangeText={(newValue) => setAreaName(newValue)}
            required
          />
          <TextInput
            placeholder="Area Code"
            style={ComonStyles.inputStyle1}
            value={areaCode}
            inputMode="numeric"
            onChangeText={(newValue) => SetAreaCode(newValue)}
            required
          />
          <CustomButton
            title={"Add Area"}
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

export default AddArea;
