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
import React, { useState } from "react";
import ComonStyles from "../../utils/CommonCss";
import CustomButton from "../../utils/CommonButton";
import HostName from "../../utils/HostName";


const SignUp = ({ navigation }) => {
  const [username, SetUsername] = useState("");
  const [password, SetPassword] = useState("");
  const [email, SetEmail] = useState("");
  const [number, SetNumber] = useState(null);
  const [cnic, SetCnic] = useState(null);


  const signup = async() => {

    try {
      
      const response = await fetch(`${HostName}user/signup`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: username,
          password,
          email,
          number,
          cnic,
        }),
      })
  
      const data = await response.json();
      if (data){
        console.log(data);
          navigation.navigate("Login");
      }
      else {
        Alert.alert("Failed to Sign Up!", "Server error");
      }
    } catch (error) {
      Alert.alert("Failed to Sign Up!", "Server error");
    }

  }
  function singup() {
    if (username === "" || password === "" || email === "" || number === null || cnic === null){
      Alert.alert("Alert!", "Fill form completely");
    }
    else {
      fetch(`${HostName}user/signup`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: username,
          password,
          email,
          number,
          cnic,
        }),
      })
        .then((res) => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error("Something went wrong");
          }
          return res.json();
        })
        .then((data) => {
          console.log(data);
          navigation.navigate("Login");
        })
        .catch((err) => {
          Alert.alert("Failed to Sign Up!", err);
          // console.log(err.data.msg);
        });

    }
  }

  const handleSignUp = async () => {
    console.log(number +" "+ cnic);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "" || password === "" || number === null || username === "" || cnic === null) {
      Alert.alert("Alert!", "Please fill the form completely.");
    } else {
      try {
        if (!emailRegex.test(email)) {
          Alert.alert('Alert!', 'Entered value is not an email');
          return;
        }
        if (number.length  != 11){
          Alert.alert('Alert!', 'Contact No. length should be 11 digits');
        return;
        }

        const res = await fetch(`${HostName}user/signup`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            name: username,
            number,
            password,
            cnic
          })
        })

        const data = await res.json();
        if (data.message && !data.userId){
          Alert.alert("Alert!", data.message);
          return;
        }
        if (data.userId) {
          Alert.alert("Alert!", data.message);
          navigation.navigate("Login");
          return;
        }
      } catch (err) {
        Alert.alert("Error!", err.message);
        return;
      }
    }
  }

  return (
    <View style={styles.body}>
      <Text style={ComonStyles.heading1}>SignUp</Text>
      <TextInput
        placeholder="Username"
        style={ComonStyles.inputStyle1}
        value={username}
        inputMode="text"
        onChangeText={(newValue) => SetUsername(newValue)}
      />
      <TextInput
        placeholder="Email"
        style={ComonStyles.inputStyle1}
        value={email}
        inputMode="email"
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
      <TextInput
        placeholder="Phone No."
        style={ComonStyles.inputStyle1}
        value={number}
        inputMode="numeric"
        onChangeText={(newValue) => SetNumber(newValue)}
      />
      <TextInput
        placeholder="CNIC"
        style={ComonStyles.inputStyle1}
        value={cnic}
        inputMode="numeric"
        onChangeText={(newValue) => SetCnic(newValue)}
      />

      <CustomButton
        title={"Sign Up"}
        color={"#000"}
        style={{ width: "80%", borderRadius: 10, margin: 10 }}
        handleOnPress={handleSignUp}
      />
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.text15}>Go Back</Text>
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

export default SignUp;
