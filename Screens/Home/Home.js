import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Button
} from "react-native";
import React, { Component, useCallback, useState } from "react";
import SalesFlatList from "../../utils/SalesFlatList";
import { TouchableOpacity } from "react-native-gesture-handler";
import CustomButton from "../../utils/CommonButton";
import CommonFlatList from '../../utils/CommonFlatList';
import { LineChart } from "react-native-chart-kit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";
import HostName from "../../utils/HostName";
import { Alert } from "react-native";
import WarehouseFlatList from "../../utils/WarehouseFlatlist";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import ComonStyles from "../../utils/CommonCss";
import Header from "../../utils/Header";

export function Home({ navigation }) {
  const windowWidth = useWindowDimensions().width;
  const width = windowWidth - 40;
  const [user, setUser] = useState();
  const [productData, setProductData] = useState();
  const [shopData, setShopData] = useState();
  const [lowStockProductData, setLowStockProductData] = useState();
  useFocusEffect(
    useCallback(() => {
      fetchUserDetails();
      fetchStockData();
      fetchShopData();
      fetchLowStockProductData();
      calculateProductRevenues();
    }, [])
  )
  const calculateProductRevenues = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      const response = await fetch(`${HostName}products/update-product-revenue`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${jwtToken}`
        },
        method: "GET"
      })
      const data = response.json();
      if (data) {
        console.log("Product revenue updated");
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Failure!", "Product revenue couldn't be calculated!"
      );
    }
  }
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
  const fetchStockData = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      const response = await fetch(`${HostName}products/top-products`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${jwtToken}`
        },
        method: "GET"
      })
      const Data = await response.json();
      setProductData(Data.products);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Failure!", "No Products found"
      );
    }
  };
  const fetchShopData = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      const response = await fetch(`${HostName}shops/top-shops`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${jwtToken}`
        },
        method: "GET"
      })
      const Data = await response.json();
      setShopData(Data.shops);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Failure!", "No Products found"
      );
    }
  };
  const fetchLowStockProductData = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      const response = await fetch(`${HostName}products/low-stock-products`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${jwtToken}`
        },
        method: "GET"
      })
      const Data = await response.json();
      if (!Data.products) {
        setLowStockProductData(null);
      }
      else {
        setLowStockProductData(Data.products);
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Failure!", "No Low Stock Products found"
      );
    }
  };
  return (
    <ScrollView>
      <View style={styles.body}>
        <Header
          screenName={"Home"} navigation={navigation}
        />
        <View style={styles.row}>
          <View style={styles.viewbox}>
            <Text style={styles.heading}>Inventory Available</Text>
            <Text style={styles.numberDisplay}>{user ? user.currentTotalStock : 0}</Text>
          </View>

          <View style={styles.viewbox}>
            <Text style={styles.heading}>Sold in one day</Text>
            <Text style={styles.numberDisplay}>NULL</Text>
          </View>
        </View>

        <View style={styles.flatlist}>
          <View style={styles.headingFlatlist}>
            <Text style={styles.head}>Top Performing Products</Text>
          </View>
          <SafeAreaView>
            {
              productData ?
                productData.map(item => (
                  <SalesFlatList
                    title={item.productName}
                    key={item._id}
                  />
                ))
                :
                <></>
            }
          </SafeAreaView>
        </View>

        <View style={styles.flatlist}>
          <View style={styles.headingFlatlist}>
            <Text style={styles.head}>Top Performing Shops</Text>
          </View>
          <SafeAreaView>
            {
              shopData ?
                shopData.map(item => (
                  <CommonFlatList
                    title={item.shopName}
                    shopId={item._id}
                    navigation={navigation}
                    revenue={item.revenue}
                    key={item._id}
                  />
                ))
                :
                <></>
            }
          </SafeAreaView>
        </View>

        <View style={styles.flatlist}>
          <View style={styles.headingFlatlist}>
            <Text style={styles.head}>Low Stock Products</Text>
          </View>
          <SafeAreaView>
            {
              lowStockProductData ?
                lowStockProductData.map(item => (
                  <WarehouseFlatList
                    title={item.productName}
                    quantity={item.stockQuantity}
                    key={item._id}
                  />
                ))
                :
                <View style={styles.flatlist}>
                  <View style={styles.headingFlatlist}>
                    <Text>No Low Stock Products</Text>
                  </View>
                </View>
            }
          </SafeAreaView>
        </View>

        <View style={styles.flatlist}>
          <CustomButton
            title={"Get Investment"}
            color={"#000"}
            style={{ width: "95%", borderRadius: 10, margin: 10, fontSize: 10 }}
            handleOnPress={() => { console.log("Moving to Website") }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end", // Aligns the boxes to the top right corner
    marginTop: 10, // Added margin to separate from the top
  },
  viewbox: {
    flexDirection: "column",
    borderRadius: 10,
    elevation: 20,
    shadowColor: "#777777bb",
    backgroundColor: "#fff",
    margin: 5,
    width: "45%", // Set the width to a percentage or vw/vh
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
});

export default Home;
