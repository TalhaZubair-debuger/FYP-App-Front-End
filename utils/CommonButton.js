import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

const CustomButton = ({ handleOnPress, title, color, style }) => {
  return (
    <Pressable
      onPress={handleOnPress}
      //  delayLongPress={200}
      hitSlop={{ top: 10, botton: 10, right: 10, left: 10 }}
      android_ripple={{ color: "#h1h1h1" }}
      style={({ pressed }) => [
        { backgroundColor: pressed ? "#dddddd" : color },
        styles.button,
        { ...style },
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  text: {
    color: "#fff",
    fontSize: 20,
    margin: 10,
    textAlign: "center",
  },
  button: {
    width: 150,
    // backgroundColor: '#00ff00',
    alignItems: "center",
  },
});

export default CustomButton;
