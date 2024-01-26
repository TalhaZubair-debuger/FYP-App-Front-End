import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
import React, { Component, useCallback, useState } from "react";
import { FlatList } from "react-native";
import VendorsFlatList from "../../utils/VendorsFlatList";
import CommonButton from "../../utils/CommonButton";
import { TextInput } from "react-native";
import CommonCss from "../../utils/CommonCss"
import { Alert } from "react-native";
import HostName from "../../utils/HostName";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";
import Header from "../../utils/Header";

export function Finance({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [vendorName, setVendorName] = useState("");
  const [vendorContact, setVendorContact] = useState(null);
  const [data, setData] = useState([]);
  useFocusEffect(
    useCallback(() => {
      fetchTopVendorData()
    }, [data])
  )

  const fetchTopVendorData = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      const response = await fetch(`${HostName}vendors/top-vendors`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${jwtToken}`
        },
        method: "GET"
      })
      const Data = await response.json();
      setData(Data.vendors);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Failure", error.message
      );
    }
  };

  const addVendor = async () => {
    if (
      vendorName === "" ||
      vendorContact === null
    ) {
      Alert.alert("Failure", "Please fill form completely");
    }
    else {
      const formData = { vendorName, vendorContact };

      try {
        const jwtToken = await AsyncStorage.getItem("jwtToken")
        const response = await fetch(`${HostName}vendors/add-vendor`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${jwtToken}`
          },
          method: "PUT",
          body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (data.message) {
          setVendorContact(null);
          setVendorName("");
          setModalVisible(!modalVisible);
          if (!data.vendor) {
            Alert.alert("Failure!", data.message);
          }
          else {
            Alert.alert("Success!", data.message);
          }
        }
      }
      catch (error) {
        Alert.alert("Failure!", error.message);
        console.log(error);
      }
    }
  }
  return (
    <ScrollView style={styles.topContainer}>


      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.headingFlatlist}>
            <Text style={styles.head}>Add new vendor</Text>
          </View>
          <TextInput
            placeholder="Vendor Name"
            style={CommonCss.inputStyle1}
            value={vendorName}
            inputMode="text"
            onChangeText={(newValue) => setVendorName(newValue)}
            required
          />
          <TextInput
            placeholder="Vendor Contact"
            style={CommonCss.inputStyle1}
            value={vendorContact}
            inputMode="numeric"
            onChangeText={(newValue) => setVendorContact(newValue)}
            required
          />
          <CommonButton
            title={"Add Vendor"}
            color={"#000"}
            style={{ width: "80%", borderRadius: 10, margin: 10, fontSize: 10 }}
            handleOnPress={addVendor}
          />
        </View>
      </Modal>


      <View style={styles.body}>
        <Header screenName={"Vendors"} navigation={navigation}/>
        <View style={styles.flatlist}>
          <View style={styles.headingFlatlist}>
            <Text style={styles.head}>Top Vendors</Text>
          </View>
          <SafeAreaView>
            <View style={styles.flatlist}>
              {
                data ?
                data.map(item => (
                  <VendorsFlatList key={item._id} title={item.vendorName} navigation={navigation} id={item._id} />
                ))
                :
                <Text>No Vendors Found</Text>
              }
            </View>
          </SafeAreaView>
        </View>

        <View style={styles.flatlist}>
          <View style={styles.row}>
            <CommonButton
              title={"All Vendors"}
              color={"#000"}
              style={{ width: "45%", borderRadius: 10, margin: 10, fontSize: 10 }}
            handleOnPress={() => navigation.navigate("All Vendors")}
            />
            <CommonButton
              title={"Add Vendor"}
              color={"#000"}
              style={{ width: "45%", borderRadius: 10, margin: 10, fontSize: 10 }}
              handleOnPress={() => setModalVisible(!modalVisible)}
            />
          </View>
          {/* <CommonButton
            title={"Products Re-Stock"}
            color={"#000"}
            style={{ width: "95%", borderRadius: 10, margin: 10, fontSize: 10 }}
            handleOnPress={() => navigation.navigate("ReOrder Products")}
          /> */}
        </View>

      </View >
    </ScrollView >
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: "column",
    // justifyContent: 'center',
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center", // Aligns the boxes to the top right corner
    marginTop: 10, // Added margin to separate from the top
  },
  viewbox: {
    flexDirection: "column",
    borderRadius: 10,
    elevation: 20,
    shadowColor: "#777777bb",
    backgroundColor: "#fff",
    margin: 5,
    width: "30%", // Set the width to a percentage or vw/vh
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 15,
  },
  numberDisplay: {
    fontSize: 45,
    fontWeight: "600",
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
    // justifyContent: 'center',
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
  topContainer: {
    flex: 1
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 200,
    marginHorizontal: 10,
    backgroundColor: "#fff",
    padding: 5,
    elevation: 30,
    shadowColor: "#000",
    borderRadius: 10
  },
});

export default Finance;
