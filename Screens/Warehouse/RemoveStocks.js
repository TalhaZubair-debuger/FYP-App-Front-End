import {
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import RemoveStockFlatList from "../../utils/RemoveStockFlatlist";
import HostName from '../../utils/HostName';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from "react-native";
import CommonCss from "../../utils/CommonCss";
import { useFocusEffect } from "@react-navigation/native";

export default function RemoveStocks({ navigation }) {
  const [data, setData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchStockData();
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
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Failure!", "No Products found"
      );
    }
  };
  return (
      <View style={styles.body}>
        <View style={styles.flatlist}>
          <View style={styles.headingFlatlist}>
            <Text style={styles.head}>Manage Stocks</Text>
          </View>
        </View>
        <View style={styles.flatlist}>
          {
            data ?
              data.length ?
                <SafeAreaView>
                  <FlatList
                    data={data}
                    renderItem={({ item }) => (
                      <RemoveStockFlatList
                        id={item._id}
                        title={item.productName}
                        navigation={navigation}
                      />
                    )}
                    keyExtractor={(item) => item._id}
                  />
                </SafeAreaView>
                :
                <></>
              :
              <Text style={CommonCss.notFound}>No Stock Found</Text>
          }
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: "column",
    // justifyContent: 'center',
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
    // justifyContent: 'center',
  },
  headingFlatlist: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  head: {
    fontSize: 30,
    fontWeight: 600,
  },
});
