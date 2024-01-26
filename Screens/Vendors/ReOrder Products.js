import { View, Text, ScrollView, StyleSheet, TextInput } from "react-native";
import React, { useState } from "react";
import CustomButton from "../../utils/CommonButton";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const ReOrderProducts = ({navigation}) => {
  
  const vendorName = "Unilever";
  const productCode = "3FE4FG7";
  const productPrice = "80";
  const vendorName2 = "P&G";
  const productCode2 = "4FED3MM";
  const productPrice2 = "100";
  const vendorName3 = "Samsung";
  const productCode3 = "EFTDBR23";
  const productPrice3 = "500";
  const [productNumber, setProductNumber] = useState(0);
  const incrementProducts = () => {
    setProductNumber(productNumber + 1);
    textChange(productNumber);
  };

  const decrementProducts = () => {
    setProductNumber(productNumber - 1);
    textChange(productNumber);
  };
  const textChange = (text) => {
    setProductNumber(text);
  };

  return (
    <ScrollView>
      <View style={styles.body}>
        <View style={styles.flatlist}>
          <View>
            <Text style={styles.head}>Mobile Cover</Text>
          </View>
          <View style={styles.details}>
            <View style={styles.line}>
              <Text style={styles.bold}>Vendor Name:</Text>
              <Text>{vendorName}</Text>
            </View>
            <View style={styles.line}>
              <Text style={styles.bold}>Product Code:</Text>
              <Text>{productCode}</Text>
            </View>
            <View style={styles.line}>
              <Text style={styles.bold}>Product Price:</Text>
              <Text>{productPrice}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.head}>Order Quantity</Text>
          </View>
          <View style={styles.line2}>
            <TextInput
              style={styles.textInput}
              inputMode="numeric"
              onChangeText={(text) => textChange(text)}
              defaultValue={productNumber}
              maxLength={6}
            />
            <CustomButton
              title={
                <FontAwesome5
                  name={"caret-square-up"}
                  size={25}
                  color={"#fff"}
                />
              }
              color={"#000"}
              style={{ width: "20%", marginLeft: 10, fontSize: 10 }}
              // handleOnPress={() => navigation.navigate("All Vendors")}
              handleOnPress={incrementProducts}
            />
            <CustomButton
              title={
                <FontAwesome5
                  name={"caret-square-down"}
                  size={25}
                  color={"#fff"}
                />
              }
              color={"#000"}
              style={{ width: "20%", fontSize: 10 }}
              // handleOnPress={() => navigation.navigate
              handleOnPress={decrementProducts}
            />
          </View>
          <CustomButton
            title={"Request Order"}
            color={"#000"}
            style={{ width: "90%", borderRadius: 10, margin: "5%" }}
            handleOnPress={() => navigation.navigate("Finance")}
          />
        </View>
        <View style={styles.flatlist}>
          <View>
            <Text style={styles.head}>Hair Straightener</Text>
          </View>
          <View style={styles.details}>
            <View style={styles.line}>
              <Text style={styles.bold}>Vendor Name:</Text>
              <Text>{vendorName2}</Text>
            </View>
            <View style={styles.line}>
              <Text style={styles.bold}>Product Code:</Text>
              <Text>{productCode2}</Text>
            </View>
            <View style={styles.line}>
              <Text style={styles.bold}>Product Price:</Text>
              <Text>{productPrice2}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.head}>Order Quantity</Text>
          </View>
          <View style={styles.line2}>
            <TextInput
              style={styles.textInput}
              inputMode="numeric"
              onChangeText={(text) => textChange(text)}
              defaultValue={productNumber}
              maxLength={6}
            />
            <CustomButton
              title={
                <FontAwesome5
                  name={"caret-square-up"}
                  size={25}
                  color={"#fff"}
                />
              }
              color={"#000"}
              style={{ width: "20%", marginLeft: 10, fontSize: 10 }}
              // handleOnPress={() => navigation.navigate("All Vendors")}
              handleOnPress={incrementProducts}
            />
            <CustomButton
              title={
                <FontAwesome5
                  name={"caret-square-down"}
                  size={25}
                  color={"#fff"}
                />
              }
              color={"#000"}
              style={{ width: "20%", fontSize: 10 }}
              // handleOnPress={() => navigation.navigate
              handleOnPress={decrementProducts}
            />
          </View>
          <CustomButton
            title={"Request Order"}
            color={"#000"}
            style={{ width: "90%", borderRadius: 10, margin: "5%" }}
            handleOnPress={() => navigation.navigate("Sales")}
          />
        </View>
        <View style={styles.flatlist}>
          <View>
            <Text style={styles.head}>GTX 1660s</Text>
          </View>
          <View style={styles.details}>
            <View style={styles.line}>
              <Text style={styles.bold}>Vendor Name:</Text>
              <Text>{vendorName3}</Text>
            </View>
            <View style={styles.line}>
              <Text style={styles.bold}>Product Code:</Text>
              <Text>{productCode3}</Text>
            </View>
            <View style={styles.line}>
              <Text style={styles.bold}>Product Price:</Text>
              <Text>{productPrice3}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.head}>Order Quantity</Text>
          </View>
          <View style={styles.line2}>
            <TextInput
              style={styles.textInput}
              inputMode="numeric"
              onChangeText={(text) => textChange(text)}
              defaultValue={productNumber}
              maxLength={6}
            />
            <CustomButton
              title={
                <FontAwesome5
                  name={"caret-square-up"}
                  size={25}
                  color={"#fff"}
                />
              }
              color={"#000"}
              style={{ width: "20%", marginLeft: 10, fontSize: 10 }}
              // handleOnPress={() => navigation.navigate("All Vendors")}
              handleOnPress={incrementProducts}
            />
            <CustomButton
              title={
                <FontAwesome5
                  name={"caret-square-down"}
                  size={25}
                  color={"#fff"}
                />
              }
              color={"#000"}
              style={{ width: "20%", fontSize: 10 }}
              // handleOnPress={() => navigation.navigate
              handleOnPress={decrementProducts}
            />
          </View>
          <CustomButton
            title={"Request Order"}
            color={"#000"}
            style={{ width: "90%", borderRadius: 10, margin: "5%" }}
            handleOnPress={() => navigation.navigate("Sales")}
          />
        </View>
      </View>
    </ScrollView>
  );
};

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
    margin: 5,
    padding: 5,
    flexDirection: "column",
    // alignItems: "center",
    // justifyContent: "center",
  },
  headingFlatlist: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  head: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    fontWeight: 600,
    marginLeft: "30%",
    // marginRight: "20%",
  },
  head2: {
    fontSize: 20,
    fontWeight: 600,
    width: "100%",
    flex: 1,
  },
  line: {
    // flex:1,
    flexDirection: "row",
  },
  line2: {
    // flex:1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  bold: {
    fontWeight: "bold",
    marginRight: 5,
  },
  textInput: {
    width: "22%",
    height: 50,
    margin: 10,
    fontSize: 15,
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000",
  },
});

export default ReOrderProducts;
