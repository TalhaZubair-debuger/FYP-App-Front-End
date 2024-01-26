import {
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Button,
  Pressable,
  TextInput,
} from "react-native";
import ManageShopsFlatList from "../../utils/ManageShopsFlatList";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import HostName from "../../utils/HostName";
import { Touchable } from "react-native";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export default function ManageShops({ navigation }) {
  const [data, setData] = useState([]);

  const fetchStockData = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      const response = await fetch(`${HostName}shops/shop`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${jwtToken}`
        },
        method: "GET"
      })
      const Data = await response.json();
      setData(Data.shops);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Failure", "Failed to fetch Shops Data. Please try again later."
      );
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchStockData()
    }, [])
  )

  const handleEdit = (shopID) => {
    navigation.navigate("Edit Shop", { shopID });
  }
  const handleDelete = async (shopID) => {
    try {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      const response = await fetch(`${HostName}shops/shop/${shopID}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${jwtToken}`
        },
        method: "DELETE"
      })
      const Data = await response.json();
      Alert.alert("Success", `${Data.message}`);
      fetchStockData();
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Failure", "Failed to delete shop."
      );
    }
  }
  return (
    <View style={styles.body}>
      <View style={styles.flatlist}>
        <View style={styles.headingFlatlist}>
          <Text style={styles.head}>Manage Shops</Text>
        </View>
      </View>
      <View style={styles.flatlist}>
        <SafeAreaView>
          {
            data?

            <FlatList
              data={data}
              renderItem={({ item }) => (
  
                <View style={styles.item}>
                  <Text style={styles.title}>{item.shopName}</Text>
                  <Text style={styles.purchase}>
                    <View style={styles.fontawesome}>
                      <Pressable onPress={() => handleEdit(item._id)}>
                        <Text style={styles.innerFonts}>
                          <FontAwesome5 name={"edit"} size={20} color={"#aaaaaa"} />
                        </Text>
                      </Pressable>
                      <Pressable onPress={() => handleDelete(item._id)}>
                        <Text style={styles.innerFonts}>
                          <FontAwesome5 name={"trash-alt"} size={20} color={"#ff0000"} />
                        </Text>
                      </Pressable>
                    </View>
                  </Text>
                </View>
  
              )}
              keyExtractor={item => item._id}
            />
            :
            <Text style={styles.textCenter}>No Shops found</Text>
          }
        </SafeAreaView>
      </View>
    </View>
  );
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
  headingFlatlist: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  head: {
    fontSize: 30,
    fontWeight: 600,
  },
  item: {
    flex: 1,
    flexDirection: "row",
    // justifyContent: 'center',
    alignItems: "center",
    width: "100%",
    borderRadius: 10,
    boxShadow: "5px 5px #777777bb",
    // elevation: 20,
    // shadowColor: '#777777bb',
    backgroundColor: "#dddddd55",
    marginBottom: 5,
    height: 60,
  },
  title: {
    fontSize: 20,
    flex: 1,
    justifyContent: "center",
    textAlign: "left",
    maxWidth: 150,
    borderRightColor: "#aaa",
    borderRightWidth: 2,
    marginLeft: 5,
  },
  purchase: {
    flex: 1,
    justifyContent: "center",
    fontSize: 20,
    textAlign: "right",
    marginRight: 5,
  },
  color: {
    fontSize: 20,
    color: "#00FF00",
  },
  fontawesome: {
    margin: 5,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  innerFonts: {
    margin: 10,
  },
  hidden: {
    display: "none"
  },
  textCenter: {
    textAlign: "center"
  }
});
