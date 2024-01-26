import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AsyncStorage from '@react-native-async-storage/async-storage';


const Header = ({ screenName, navigation }) => {
    const logOut = async () => {
        await AsyncStorage.removeItem("jwtToken");
        navigation.navigate("Login");
      }
    return (
        <View style={styles.topRow}>
            <View >
                <Text style={styles.pageName}>{screenName}</Text>
            </View>
            <TouchableOpacity onPress={logOut} style={styles.logOut}>
                <Text >
                    <FontAwesome5 name={"sign-out-alt"} size={25} color={"black"} />
                </Text>
                <Text style={styles.font12}>LogOut</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Header;

const styles = StyleSheet.create({
    topRow: {
        height: 100,
        width: "100%",
        backgroundColor: "#fff",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: 5,
        paddingTop: 50,
        flex: 1
    },
    pageName: {
        fontSize: 20,
        fontWeight: "600"
    },
    logOut: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    font12: {
        fontSize: 12
    }
})