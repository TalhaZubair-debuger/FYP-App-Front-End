import { View, Text, StyleSheet, Touchable } from "react-native";
import React from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const ManageShopsFlatList = ({ title, id }) => {

  return (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.purchase}>
        <View style={styles.fontawesome}>
          <Text style={styles.innerFonts}>
            <FontAwesome5 name={"edit"} size={20} color={"#aaaaaa"} />
          </Text>
          <Text style={styles.innerFonts}>
            <Touchable onPress={deleteShopData(id)}>
              <FontAwesome5 name={"trash-alt"} size={20} color={"#ff0000"} />
            </Touchable>
          </Text>
        </View>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
});
export default ManageShopsFlatList;
