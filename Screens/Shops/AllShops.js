import { FlatList, SafeAreaView, ScrollView, Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import CommonFlatList from '../../utils/CommonFlatList';
import React, { useCallback, useEffect, useState } from 'react';
import HostName from '../../utils/HostName';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonCss from "../../utils/CommonCss";
import { useFocusEffect } from '@react-navigation/native';


export default function AllShops({ navigation }) {
  const [data, setData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchShopData()
    }, [])
  )

  const fetchShopData = async () => {
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
      // if (Data)
      // console.log(Data);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Failure", "Failed to fetch Shops Data. Please add a new shop."
      );
    }
  };


  return (
    <View style={styles.body}>
      <View style={styles.flatlist}>
        <View style={styles.headingFlatlist}>
          <Text style={styles.head}>All Shops</Text>
        </View>
      </View>
      <View style={styles.flatlist}>
        {
          data ? 
        <SafeAreaView>
          <FlatList
            data={data}
            renderItem={({ item }) => <CommonFlatList
              title={item.shopName}
              shopId={item._id}
              revenue={item.revenue}
              navigation={navigation} />}
            keyExtractor={item => item._id}

          />
        </SafeAreaView> 
        : 
        <Text style={CommonCss.notFound}>No Shops Found</Text>
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: 'column',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  flatlist: {
    backgroundColor: '#fff',
    width: '95%',
    borderRadius: 10,
    boxShadow: '5px 5px',
    elevation: 20,
    shadowColor: '#777777bb',
    padding: 5,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5
    // justifyContent: 'center',
  },
  headingFlatlist: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  head: {
    fontSize: 30,
    fontWeight: 600,
  },
})