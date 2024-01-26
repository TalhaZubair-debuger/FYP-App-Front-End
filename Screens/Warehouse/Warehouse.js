import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import React, { Component, useCallback, useState } from "react";
import WarehouseFlatList from "../../utils/WarehouseFlatlist";
import { SafeAreaView } from "react-native";
import { FlatList } from "react-native";
import CustomButton from "../../utils/CommonButton";
import { Modal } from "react-native";
import CommonCss from "../../utils/CommonCss";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HostName from "../../utils/HostName";
import { Alert } from "react-native";
import Header from "../../utils/Header";

export const Warehouse = ({ navigation }) => {
  const [modalEditProductVisible, setModalEditProductVisible] = useState(false);
  const [productName, setProductName] = useState("");
  const [productQuantity, setProductQuantity] = useState(null);
  const [data, setData] = useState([]);
  const [user, setUser] = useState();

  useFocusEffect(
    useCallback(() => {
      fetchStockData();
      fetchUserDetails();
    }, [data])
  )
  const fetchStockData = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      const response = await fetch(`${HostName}products/products`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${jwtToken}`
        },
        method: "GET"
      })
      const Data = await response.json();
      setData(Data.products);
      // setProductName(Data.products[0].productName);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Failure!", "No Products found"
      );
    }
  };
  const fetchUserDetails = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      const response = await fetch(`${HostName}user/get-user`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${jwtToken}`
        },
        method: "GET"
      })
      const Data = await response.json();
      setUser(Data.user);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Failure!", "No User Data found"
      );
    }
  }
  const submitAddProductStock = async () => {
    if (
      productName === "" ||
      productQuantity === null
    ) {
      Alert.alert("Failure", "Please fill form completely");
    } else {
      const formData = {
        productName,
        stockQuantity: productQuantity
      };

      try {
        const jwtToken = await AsyncStorage.getItem("jwtToken");
        const response = await fetch(`${HostName}products/update-stocks`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${jwtToken}`
          },
          method: "POST",
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (data.stockQuantity) {
          setProductName("");
          setProductQuantity(null);
          Alert.alert("Success", `${data.message}`);
        }
      } catch (error) {
        Alert.alert("Failed!", `${error.message}`);
        console.log(error);
      }
    }
  }

  return (
    <ScrollView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalEditProductVisible}
        onRequestClose={() => {
          setModalEditProductVisible(!modalEditProductVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.headingFlatlist}>
            <Text style={styles.head}>Add Product Stock</Text>
          </View>
          <Text style={styles.textLeft}>Product Name</Text>

          <View style={styles.dropdown2}>
            <Picker
              selectedValue={productName}
              onValueChange={(newValue) => setProductName(newValue)}
            >
              {
                data ?
                  data.length ?
                    data.map((item, index) => (
                      <Picker.Item key={index} label={item.productName} value={item.productName} />
                    ))
                    : <Text>No Products Found</Text>
                  : <Text>Error fetching data!</Text>
              }
            </Picker>
          </View>

          <Text style={styles.textLeft}>Product Quantity</Text>
          <TextInput
            placeholder="Product Quantity"
            style={CommonCss.inputStyle1}
            value={productQuantity}
            inputMode="numeric"
            onChangeText={(newValue) => setProductQuantity(newValue)}
            required
          />
          <CustomButton
            title={"Add Product"}
            color={"#000"}
            style={{ width: "80%", borderRadius: 10, margin: 10, fontSize: 5 }}
            handleOnPress={submitAddProductStock}
          />
        </View>
      </Modal>

      <View style={styles.body}>
      <Header screenName={"Warehouse"} navigation={navigation}/>
        <View style={styles.flatlist}>
          <View style={styles.headingFlatlist}>
            <Text style={styles.head}>Current Warehouse Stock</Text>
          </View>
          <SafeAreaView>
            {
              data ?
                data.slice(0, 3).map(item => (
                  <WarehouseFlatList
                    key={item._id}
                    title={item.productName}
                    quantity={item.stockQuantity}
                  />
                ))
                :
                <Text style={styles.textCenter}>No stock found</Text>
            }
          </SafeAreaView>
        </View>
        <View style={styles.flatlist}>
          <View style={styles.headingFlatlist}>
            <Text style={styles.head}>Current Stock Data</Text>
          </View>
          <View style={styles.row}>
            <View style={styles.viewbox}>
              <Text style={styles.heading}>Current Stock</Text>
              <Text style={styles.numberDisplay}>{user ? user.currentTotalStock : 0}</Text>
            </View>

            <View style={styles.viewbox}>
              <Text style={styles.heading}>New Products</Text>
              <Text style={styles.numberDisplay}>{data ? data.length ? data.length : 0 : 0}</Text>
            </View>

            <View style={styles.viewbox}>
              <Text style={[styles.heading]}>Stock dispatched</Text>
              <Text style={styles.numberDisplay}>NULL</Text>
            </View>
          </View>
        </View>
        <View style={styles.flatlist}>
          <CustomButton
            title={"Add Stock"}
            color={"#000"}
            style={{ width: "95%", borderRadius: 10, margin: 10, fontSize: 10 }}
            handleOnPress={() => setModalEditProductVisible(!modalEditProductVisible)}
          />
        </View>
        <View style={styles.flatlist}>
          <CustomButton
            title={"Add New Product"}
            color={"#000"}
            style={{ width: "95%", borderRadius: 10, margin: 10, fontSize: 10 }}
            handleOnPress={() => navigation.navigate("AddStocks")}
          />
          <CustomButton
            title={"Manage Stock"}
            color={"#000"}
            style={{ width: "95%", borderRadius: 10, margin: 10, fontSize: 10 }}
            handleOnPress={() => navigation.navigate("ManageStocks")}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  textCenter: {
    textAlign: "center"
  },
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
  },
  headingFlatlist: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    margin: 10,
  },
  head: {
    fontSize: 20,
    fontWeight: 600,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  viewbox: {
    flexDirection: "column",
    borderRadius: 10,
    elevation: 20,
    shadowColor: "#777777bb",
    backgroundColor: "#fff",
    margin: 5,
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 15,
    textAlign: "center"
  },
  numberDisplay: {
    fontSize: 30,
    fontWeight: "600",
  },
  centeredView: {
    justifyContent: "flex-start",
    alignItems: 'center',
    marginTop: 200,
    marginHorizontal: 10,
    backgroundColor: "#fff",
    padding: 5,
    elevation: 50,
    shadowColor: "#000",
    borderRadius: 10,
    shadowRadius: 20,
    borderColor: "#000",
    borderWidth: 1
  },
  textLeft: {
    textAlign: "justify",
    width: "80%"
  },
  dropdown2: {
    borderWidth: 2,
    borderColor: "#000",
    width: "80%",
    color: "#000",
    borderColor: "#000",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    marginVertical: 5
  },
});

export default Warehouse;
