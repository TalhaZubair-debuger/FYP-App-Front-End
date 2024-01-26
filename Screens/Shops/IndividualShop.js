import { ScrollView, Text, View, useWindowDimensions } from 'react-native'
import React, { Component, useCallback, useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import CommonButton from '../../utils/CommonButton'
import { useFocusEffect, useRoute } from '@react-navigation/native';
import HostName from '../../utils/HostName';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

export function IndividualShop({ navigation }) {
  const [shopData, setShopData] = useState("");
  const [monthlyData, setMonthyData] = useState();
  const route = useRoute();
  const windowWidth = useWindowDimensions().width;
  const width = windowWidth - 40;
  const shopId = route.params.shopId;

  useFocusEffect(
    useCallback(() => {
      getShopData();
      fetchMonthlyShopRecordData();
    }, [])
  )
  const getShopData = async () => {

    try {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      const response = await fetch(`${HostName}shops/shop/${shopId}`, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `${jwtToken}`
        },
        method: "GET"
      })
      const data = await response.json();
      setShopData(data.shop);
    } catch (error) {
      Alert.alert("Failed!", `${error.message}`);
      console.log(error);
    }
  }

  const fetchMonthlyShopRecordData = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      const response = await fetch(`${HostName}shop-records/get-monthly-records/${shopId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${jwtToken}`
        },
        method: "GET"
      })
      const Data = await response.json();
      if (Data) {
        console.log(Data.shopRecord.predictedRevenue);
        setMonthyData(Data.shopRecord);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <ScrollView>

      <View style={styles.body}>
        <View style={styles.flatlist}>
          <View style={styles.headingFlatlist}>
            <Text style={styles.head}>Shop</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.bold}>Shop Name: </Text>
            <Text>{shopData.shopName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.bold}>Shop Number: </Text>
            <Text>{shopData.registration}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.bold}>Shop Location: </Text>
            <Text>-</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.bold}>Shop Area: </Text>
            <Text>{shopData.area}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.bold}>Owner CNIC: </Text>
            <Text>{shopData.ownerCnic}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.bold}>Owner Contact: </Text>
            <Text>{shopData.ownerPhoneNo}</Text>
          </View>
        </View>

        <View style={styles.flatlist}>
          <View style={styles.align}>
            <CommonButton
              title={"Generate Sales Report"}
              color={"#000"}
              style={{ width: "90%", borderRadius: 10, margin: "5%" }}
              handleOnPress={() => console.log("Generated Report!")}
            />
          </View>
        </View>

        <View style={styles.flatlist}>
          <View style={styles.align}>
            <CommonButton
              title={"Shop Records"}
              color={"#000"}
              style={{ width: "90%", borderRadius: 10, margin: "5%" }}
              handleOnPress={() => navigation.navigate("Shop Records", { shopId: shopData._id })}
            />
          </View>
        </View>

        <View style={styles.flatlist}>
          <Text style={styles.head2}>Predicted Revenue for next month</Text>
          <Text style={styles.head3}>Rs.{monthlyData ? monthlyData.predictedRevenue ? parseInt(monthlyData.predictedRevenue) : 0 : 0}</Text>
        </View>

        <View style={styles.barchart}>
          <View style={styles.headingFlatlist}>
            <Text style={styles.head}>Product Sales Chart</Text>
          </View>
          {
            monthlyData ?
              <LineChart
                data={{
                  labels: ["November", "December", "January"],
                  datasets: [
                    {
                      data: [
                        monthlyData.monthlyRecords[0] ? monthlyData.monthlyRecords[0].revenue : 0,
                        monthlyData.monthlyRecords[1] ? monthlyData.monthlyRecords[1].revenue : 0,
                        monthlyData.monthlyRecords[2] ? monthlyData.monthlyRecords[2].revenue : 0,
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
    </ScrollView>
  )
}

const styles = StyleSheet.create({
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
  row: {
    flexDirection: "row",
    justifyContent: "flex-start", // Aligns the boxes to the top right corner
    marginTop: 10, // Added margin to separate from the top
  },
  bold: {
    fontWeight: "600"
  }
})

export default IndividualShop