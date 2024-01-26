import { FlatList, Text, View } from 'react-native'
import React, { Component, useCallback, useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import CommonButton from '../../utils/CommonButton'
import { useFocusEffect, useRoute } from '@react-navigation/native';
import HostName from '../../utils/HostName';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native';
import { Modal } from 'react-native';
import { TextInput } from 'react-native';
import CommonCss from "../../utils/CommonCss";
import { Alert } from 'react-native';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Pressable } from 'react-native';

export function IndividualVendor({ navigation }) {
  const [vendorData, setVendorData] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(null);
  const [vendorName, setVendorName] = useState("");
  const [vendorContact, setVendorContact] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditProductVisible, setModalEditProductVisible] = useState(false);
  const [modalAllProductVisible, setModalAllProductVisible] = useState(false);
  const route = useRoute();
  const vendorId = route.params.vendorId;

  useFocusEffect(
    useCallback(() => {
      getVendorData();
    }, [vendorData])
  )
  const getVendorData = async () => {

    try {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      const response = await fetch(`${HostName}vendors/vendor/${vendorId}`, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `${jwtToken}`
        },
        method: "GET"
      })
      const data = await response.json();
      if (!data.vendor) {
        Alert.alert("Failure!", `${data.message}`);
      }
      else {
        setVendorData(data.vendor);
      }
    } catch (error) {
      Alert.alert("Failed!", `${error.message}`);
      console.log(error);
    }
  }

  const addVendorProduct = async () => {
    if (productName === "" || productPrice === null) {
      Alert.alert("Failure", "Please fill form completely");
    }
    else {
      const formData = { productName, productPrice };
      try {
        const jwtToken = await AsyncStorage.getItem("jwtToken");
        const response = await fetch(`${HostName}vendors/add-product/${vendorId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${jwtToken}`
          },
          method: "POST",
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (data.message) {
          setProductName("");
          setProductPrice(null);
          setModalVisible(!modalVisible);
          Alert.alert("Alert!", `${data.message}`);
        }
      } catch (error) {
        Alert.alert("Failed!", `${error.message}`);
        console.log(error);
      }
    }
  }
  const handleVendorProductDelete = async (productName) => {
    try {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      const response = await fetch(`${HostName}vendors/delete-product?vendorId=${vendorData._id}&productName=${productName}`, {
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
        "Failure", "Failed to delete Vendor Product."
      );
    }
  }

  const handleUpdateVendorDetails = async () => {
    if (
      vendorName === "" ||
      vendorContact === null
    ) {
      Alert.alert("Failure", "Please fill form completely");
    } else {
      const formData = {
        vendorName,
        vendorContact
      };
      try {
        const jwtToken = await AsyncStorage.getItem("jwtToken");
        const response = await fetch(`${HostName}vendors/edit-vendor/${vendorData._id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${jwtToken}`
          },
          method: "PATCH",
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (data.vendor) {
          setModalEditProductVisible(!modalEditProductVisible);
          Alert.alert("Success", `${data.message}`);
        }
      } catch (error) {
        Alert.alert("Failed!", `${error.message}`);
        console.log(error);
      }
    }
  }

  return (
    <View style={styles.body}>


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
            <Text style={styles.head}>Add new product</Text>
          </View>
          <TextInput
            placeholder="Product Name"
            style={CommonCss.inputStyle1}
            value={productName}
            inputMode="text"
            onChangeText={(newValue) => setProductName(newValue)}
            required
          />
          <TextInput
            placeholder="Product Price"
            style={CommonCss.inputStyle1}
            value={productPrice}
            inputMode="numeric"
            onChangeText={(newValue) => setProductPrice(newValue)}
            required
          />
          <CommonButton
            title={"Add Product"}
            color={"#000"}
            style={{ width: "80%", borderRadius: 10, margin: 10, fontSize: 10 }}
            handleOnPress={addVendorProduct}
          />
          <CommonButton
            title={"Cancel"}
            color={"#000"}
            style={{ width: "30%", borderRadius: 10, margin: 10, fontSize: 5 }}
            handleOnPress={() => { setModalVisible(!modalVisible); }}
          />
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalAllProductVisible}
        onRequestClose={() => {
          setModalAllProductVisible(!modalAllProductVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.headingFlatlist}>
            <Text style={styles.head}>All products of {vendorData ? vendorData.vendorName : null}</Text>
          </View>
          {
            vendorData ?
              vendorData.vendorProducts.length !== 0 ?
                <FlatList
                  data={vendorData ? vendorData.vendorProducts.length !== 0 ? vendorData.vendorProducts : null : null}
                  renderItem={({ item, index }) => (
                    <View key={index} style={styles.flatlistProducts}>
                      <Text >{item.productName}{" "}</Text>
                      <Text >{" "}Rs.{item.productPrice}</Text>
                      <View style={CommonCss.fontawesome}>
                        <Pressable onPress={() => handleVendorProductDelete(item.productName)}>
                          <Text style={styles.innerFonts}>
                            <FontAwesome5 name={"trash-alt"} size={20} color={"#ff0000"} />
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  )}
                  keyExtractor={(item) => item._id}
                />
                :
                <Text>No Vendor Product Found</Text>
              :
              <></>
          }
          <CommonButton
            title={"Close"}
            color={"#000"}
            style={{ width: "30%", borderRadius: 10, margin: 10, fontSize: 5 }}
            handleOnPress={() => { setModalAllProductVisible(!modalAllProductVisible) }}
          />
        </View>
      </Modal>

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
            <Text style={styles.head}>Edit Vendor Details</Text>
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
            title={"Update Vendor"}
            color={"#000"}
            style={{ width: "80%", borderRadius: 10, margin: 10, fontSize: 5 }}
            handleOnPress={handleUpdateVendorDetails}
          />
        </View>
      </Modal>


      <View style={styles.flatlist}>
        <View style={styles.headingFlatlist}>
          <Text style={styles.head}>Vendor</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.bold}>Vendor Name: </Text>
          <Text>{vendorData ? vendorData.vendorName : null}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.bold}>Vendor Id: </Text>
          <Text>{vendorData ? vendorData._id : null}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.bold}>Vendor Products: </Text>

          {vendorData && vendorData.vendorProducts ? (
            vendorData.vendorProducts.length > 0 ? (
              vendorData.vendorProducts.map((item, index) => (
                <Text key={index}>{item.productName}, </Text>
              ))
            ) : (
              <Text>No Products</Text>
            )
          ) : (
            <Text>No Products</Text>
          )}

        </View>
        <View style={styles.row}>
          <Text style={styles.bold}>Vendor Contact: </Text>
          <Text>{vendorData ? vendorData.vendorContact : null}</Text>
        </View>
      </View>

      <View style={styles.flatlist}>
        <View style={styles.align}>
          <CommonButton
            title={"Sales Report"}
            color={"#000"}
            style={{ width: "90%", borderRadius: 10, margin: "5%" }}
            handleOnPress={() => console.log("Generated Report!")}
          />
          <CommonButton
            title={"Vendor Records"}
            color={"#000"}
            style={{ width: "90%", borderRadius: 10, margin: "5%" }}
            handleOnPress={() => navigation.navigate("Vendor Records", {vendorId: vendorData._id})}
          />
        </View>
      </View>

      <View style={styles.flatlist}>
        <View style={styles.row}>
          <CommonButton
            title={"Add Product"}
            color={"#000"}
            style={{ width: "40%", borderRadius: 10, margin: "5%" }}
            handleOnPress={() => { setModalVisible(!modalVisible); }}
          />
          <CommonButton
            title={"All  Products"}
            color={"#000"}
            style={{ width: "40%", borderRadius: 10, margin: "5%" }}
            handleOnPress={() => setModalAllProductVisible(!modalAllProductVisible)}
          />
        </View>
      </View>

      <View style={styles.flatlist}>
        <View style={styles.row}>
          <CommonButton
            title={"Edit Vendor Details"}
            color={"#000"}
            style={{ width: "90%", borderRadius: 10, margin: "5%" }}
            handleOnPress={() => { setModalEditProductVisible(!modalEditProductVisible); }}
          />
        </View>
      </View>
    </View>
  )
}

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
    padding: 5,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  flatlistProducts: {
    backgroundColor: "#fff",
    width: "100%",
    // margin: 5,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  headingFlatlist: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    margin: 10,
  },
  head: {
    fontSize: 30,
    fontWeight: 600,
    textAlign: "center"
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start", // Aligns the boxes to the top right corner
  },
  bold: {
    fontWeight: "600"
  },
  centeredView: {
    justifyContent: 'center',
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
  innerFonts: {
    margin: 10,
  },
})

export default IndividualVendor