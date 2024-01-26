import {
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import CommonFlatList from "../../utils/CommonFlatList";
import React from "react";

export default function AllShop({ navigation }) {
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
    {
      id: 4,
      title: "ShopFour",
      purchase: "99000",
    },
    {
      id: 5,
      title: "ShopFive",
      purchase: "88000",
    },
    {
      id: 6,
      title: "ShopSix",
      purchase: "115000",
    },
  ];
  const navigateToIndividualShop = () => {
    navigation.navigate("Finance");
  };
  return (
    <View style={styles.body}>
      <View style={styles.flatlist}>
        <View style={styles.headingFlatlist}>
          <Text style={styles.head}>All Shops</Text>
        </View>
      </View>
      <View style={styles.flatlist}>
        <SafeAreaView>
          <TouchableOpacity onPress={navigateToIndividualShop}>
            <FlatList
              data={data}
              renderItem={({ item, purchase }) => (
                <CommonFlatList title={item.title} purchase={item.purchase} />
              )}
              keyExtractor={(item) => item.id}
            />
          </TouchableOpacity>
        </SafeAreaView>
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
