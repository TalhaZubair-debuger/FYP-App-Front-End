import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import React, { Component, useCallback, useState } from "react";
import CommonButton from "../../utils/CommonButton";
import ComonStyles from "../../utils/CommonCss";
import CommonFlatList from "../../utils/CommonFlatList";
import {
  Table,
  TableWrapper,
  Row,
  Cell,
  Rows,
} from "react-native-table-component";
import { ScrollView } from "react-native-gesture-handler";
import { LineChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HostName from "../../utils/HostName";
import { useFocusEffect } from "@react-navigation/native";
import Header from "../../utils/Header";

export default function Shop({ navigation }) {
  const windowWidth = useWindowDimensions().width;
  const width = windowWidth - 40;
  const [user, setUser] = useState();
  const [shopData, setShopData] = useState();
  useFocusEffect(
    useCallback(() => {
      fetchUserDetails();
      fetchShopDetails();
    }, [])
  )
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
  const fetchShopDetails = async () => {
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
        "Failure!", "No Shop Data found"
      );
    }
  }
  const data = [
    {
      id: 1,
      title: "ShopOne",
      purchase: "72500",
    },
    {
      id: 2,
      title: "ShopTwo",
      purchase: "85200",
    },
    {
      id: 3,
      title: "ShopThree",
      purchase: "105200",
    },
  ];
  return (
    <ScrollView>
      <View style={styles.body}>
        <Header screenName={"Shop"} navigation={navigation}/>
        <View style={styles.row}>
          <View style={styles.viewbox}>
            <Text style={styles.heading}>All Shops</Text>
            <Text style={styles.numberDisplay}>{user ? user.shops.length ? user.shops.length : 0 : 0}</Text>
          </View>

          <View style={styles.viewbox}>
            <Text style={styles.heading}>Areas</Text>
            <Text style={styles.numberDisplay}>{user ? user.areas.length ? user.areas.length : 0 : 0}</Text>
          </View>

          <View style={styles.viewbox}>
            <Text style={styles.heading}>Shops closed</Text>
            <Text style={styles.numberDisplay}>{user ? user.closedShops ? user.closedShops.length : 0 : 0}</Text>
          </View>
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
                    revenue={item.revenue}
                    shopId={item._id}
                    key={item._id}
                    navigation={navigation}
                  />
                ))
                :
                <Text style={styles.textCenter}>No Shop added</Text>
            }
          </SafeAreaView>
        </View>

        <View style={styles.align}>
          <CommonButton
            title={"Manage Shops"}
            color={"#000"}
            style={{ width: "80%", borderRadius: 10, margin: 10 }}
            handleOnPress={() => navigation.navigate("Manage Shops")}
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
    // justifyContent: 'center',
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

  barchart: {
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
  align: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  textCenter: {
    textAlign: "center"
  }
});
