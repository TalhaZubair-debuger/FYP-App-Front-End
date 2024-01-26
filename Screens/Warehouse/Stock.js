import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useFocusEffect, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HostName from '../../utils/HostName';
import CommonButton from '../../utils/CommonButton';
import { Modal } from 'react-native';
import { TextInput } from 'react-native';
import CommonCss from '../../utils/CommonCss';
import { LineChart } from 'react-native-chart-kit';
import { useWindowDimensions } from 'react-native';

const Stock = () => {
  const [productData, setProductData] = useState();
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(null);
  const [productQuantity, setProductQuantity] = useState(null);

  const [modalEditProductVisible, setModalEditProductVisible] = useState(false);
  const route = useRoute();
  const productId = route.params.id;
  const windowWidth = useWindowDimensions().width;
  const width = windowWidth - 40;

  useFocusEffect(
    useCallback(() => {
      getProductData();
      updateProductMonthlyRecords();
      updateProductWeeklyRecords();
    }, [])
  )
  const getProductData = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      const response = await fetch(`${HostName}products/product/${productId}`, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `${jwtToken}`
        },
        method: "GET"
      })
      const data = await response.json();
      if (!data.product) {
        Alert.alert("Failure!", `${data.message}`);
      }
      else {
        setProductData(data.product);
      }
    } catch (error) {
      Alert.alert("Failed!", `${error.message}`);
      console.log(error);
    }
  }

  const updateProductMonthlyRecords = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      const response = await fetch(`${HostName}products/update-product-monthly-records/${productId}`, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `${jwtToken}`
        },
        method: "GET"
      })
      const data = await response.json();
      if (data) {
        console.log("data recieved");
      }
    } catch (error) {
      Alert.alert("Failed!", `${error.message}`);
      console.log(error);
    }
  }


  const updateProductWeeklyRecords = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      const response = await fetch(`${HostName}products/update-product-weekly-records/${productId}`, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `${jwtToken}`
        },
        method: "GET"
      })
      const data = await response.json();
      if (data) {
        console.log("The weekly data =>",data);
      }
    } catch (error) {
      Alert.alert("Failed!", `${error.message}`);
      console.log(error);
    }
  }


  const handleUpdateProductDetails = async () => {
    if (
      productName === "" ||
      productPrice === null ||
      productQuantity === null
    ) {
      Alert.alert("Failure", "Please fill form completely");
    } else {
      const formData = {
        productName,
        price: productPrice,
        stockQuantity: productQuantity
      };
      try {
        const jwtToken = await AsyncStorage.getItem("jwtToken");
        const response = await fetch(`${HostName}products/edit-product/${productData._id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${jwtToken}`
          },
          method: "PATCH",
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (data.product) {
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
    <View>

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
            <Text style={styles.head}>Edit Product Details</Text>
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

          <TextInput
            placeholder="Product Quantity"
            style={CommonCss.inputStyle1}
            value={productQuantity}
            inputMode="numeric"
            onChangeText={(newValue) => setProductQuantity(newValue)}
            required
          />
          <CommonButton
            title={"Update Product"}
            color={"#000"}
            style={{ width: "80%", borderRadius: 10, margin: 10, fontSize: 5 }}
            handleOnPress={handleUpdateProductDetails}
          />
        </View>
      </Modal>

      <View style={styles.flatlist}>
        <View style={styles.headingFlatlist}>
          <Text style={styles.head}>Product</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.bold}>Product Name: </Text>
          <Text>{productData ? productData.productName : null}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.bold}>Product Id: </Text>
          <Text>{productData ? productData._id : null}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.bold}>Product Quantity: </Text>
          <Text>{productData ? productData.stockQuantity : null}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.bold}>Product Price: </Text>
          <Text>Rs.{productData ? productData.price : null}</Text>
        </View>
      </View>

      <View style={styles.flatlist}>
        <CommonButton
          title={"Edit Product"}
          color={"#000"}
          style={{ width: "95%", borderRadius: 10, margin: 10, fontSize: 10 }}
          handleOnPress={() => setModalEditProductVisible(!modalEditProductVisible)}
        />
      </View>

      <View style={styles.flatlist}>
        <Text style={styles.head2}>Predicted Revenue for next month</Text>
        <Text style={styles.head3}>Rs.{productData ? productData.predictedRevenue ? parseInt(productData.predictedRevenue) : 0 : 0}</Text>
      </View>

      <View style={styles.barchart}>
        <View style={styles.headingFlatlist}>
          <Text style={styles.head}>Product Sales Chart</Text>
        </View>
        {
          productData ?

          <LineChart
            data={{
              labels: ["November", "December", "January"],
              datasets: [
                {
                  data: [
                    productData.monthlyRecords[0] ? productData.monthlyRecords[0].revenue : 0,
                    productData.monthlyRecords[1] ? productData.monthlyRecords[1].revenue : 0,
                    productData.monthlyRecords[2] ? productData.monthlyRecords[2].revenue : 0,
                  ],
                },
              ],
            }}
            width={width}
            height={220}
            chartConfig={{
              backgroundColor: "#dddddd55",
              backgroundGradientFrom: "#eff3ff",
              backgroundGradientTo: "#efefef",
              decimalPlaces: 2,
              color: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 5,
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 5,
            }}
          />
          :
          <></>
        }
      </View>
    </View>
  )
}

export default Stock

const styles = StyleSheet.create({
  barchart: {
    backgroundColor: "#fff",
    width: "95%",
    borderRadius: 10,
    boxShadow: "5px 5px",
    elevation: 20,
    shadowColor: "#777777bb",
    margin: 5,
    padding: 5,
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
  head: {
    fontSize: 30,
    fontWeight: 600,
    textAlign: "center"
  },
  head2: {
    fontSize: 20,
    fontWeight: 600,
    textAlign: "center"
  },
  head3: {
    fontSize: 20,
    fontWeight: "400",
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
})