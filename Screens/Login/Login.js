import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ImageBackground,
  Pressable,
  Button,
  Alert,
} from "react-native";
import React, { useCallback, useState } from "react";
import ComonStyles from "../../utils/CommonCss";
import CustomButton from "../../utils/CommonButton";
import AsyncStorage from '@react-native-async-storage/async-storage';
import HostName from "../../utils/HostName";
import { useFocusEffect } from "@react-navigation/native";


const Login = ({ navigation }) => {
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");
  const [error, setError] = useState("");

  useFocusEffect(
    useCallback(() => {
      checkLogin()
    }, [])
  )

  const checkLogin = async () => {
    const jwtToken = await AsyncStorage.getItem("jwtToken");
    if (jwtToken) {
      const bearer = jwtToken.split(" ")[0];
      if (bearer === "Bearer") {
        navigation.navigate("HomeTabs")
      }
      else if (bearer ==="Bearer-KPO"){
        navigation.navigate("KPO")
      }
      else if (bearer ==="Bearer-Salesman"){
        navigation.navigate("Salesman")
      }
      else {
        BackHandler.exitApp();
      }
    }
  }


  const onSubmitHandler = async (event) => {
    if (!email || !password) {
      Alert.alert("Error", `Fill all fields`)
      return;
    }
    try {
      const res = await fetch(`${HostName}user/login`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });
      if (res.status === 200) {
        const data = await res.json();
        const token = data.token;
        if (data.employer) {
          if (data.employeeDesignation === "KPO") {
            await AsyncStorage.setItem('jwtToken', `Bearer-KPO ${token}`);
            navigation.navigate("KPO");
            return;
          }
          else if (data.employeeDesignation === "Salesman"){
            await AsyncStorage.setItem('jwtToken', `Bearer-Salesman ${token}`);
            navigation.navigate("Salesman");
            return;
          }
        }
        else {
          await AsyncStorage.setItem('jwtToken', `Bearer ${token}`);
          navigation.navigate("HomeTabs");
        }
      }
      else {
        setError("Login failed. Please check your credentials.");
      }

    } catch (error) {
      Alert.alert("Error", `${error.message}`)
      console.log(error);
    }
  };

  return (
    <View style={styles.body}>
      <Text style={ComonStyles.heading1}>Distribex</Text>
      <Text style={ComonStyles.heading3}>SignIn here</Text>
      <TextInput
        placeholder="Email"
        style={ComonStyles.inputStyle1}
        inputMode="email"
        value={email}
        onChangeText={(newValue) => SetEmail(newValue)}
      />
      <TextInput
        placeholder="Password"
        style={ComonStyles.inputStyle1}
        value={password}
        secureTextEntry={true}
        inputMode="text"
        onChangeText={(newValue) => SetPassword(newValue)}
      />
      <CustomButton
        title={"Sign In"}
        color={"#000"}
        style={{ width: "80%", borderRadius: 10, margin: 10 }}
        handleOnPress={onSubmitHandler}
      />
      <Text style={styles.text}>No account yet?</Text>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("SignUp")}
      >
        <Text style={styles.text15}>Sign Up Here</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 10,
    color: "#000",
  },
  text15: {
    fontSize: 15,
    color: "#000",
  },
  button: {
    margin: 10,
  },
});

export default Login;
