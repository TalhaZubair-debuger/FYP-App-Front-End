import {
    View,
    Text,
    TextInput,
    ScrollView,
    StyleSheet,
    Alert,
    Button,
} from "react-native";
import ComonStyles from "../../utils/CommonCss";
import CustomButton from "../../utils/CommonButton";
import React, { useCallback, useEffect, useState } from "react";
import HostName from "../../utils/HostName";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRoute } from '@react-navigation/native';


const EditShop = () => {
    const [shopData, setShopData] = useState();

    const [shopName, setShopName] = useState("");
    const [area, setArea] = useState(null);
    const [registration, setRegistration] = useState(null);
    const [number, setNumber] = useState(null);
    const [cnic, setCnic] = useState(null);
    const route = useRoute();
    const shopId = route.params.shopID;

    useEffect(() => {
        getShopData()
    }, [shopId]);
    useFocusEffect(
        useCallback(() => {
            getShopData()
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
            if (shopData) {
                setShopName(shopData.shopName);
                setArea(shopData.area);
                setRegistration(shopData.registration);
                setNumber(shopData.ownerPhoneNo);
                setCnic(shopData.ownerCnic);
            }
        } catch (error) {
            Alert.alert("Failed!", `${error.message}`);
            console.log(error);
        }
    }

    const submitShopData = async () => {
        const shopName1 = shopName;
        const registration1 = registration;
        const ownerPhoneNo = number;
        const ownerCnic = cnic;
        const area1 = area;
        if (
            shopName1 === "" ||
            registration1 === null ||
            ownerPhoneNo === null ||
            ownerCnic === null ||
            area1 === ""
        ) {
            Alert.alert("Failure", "Please fill form completely");
        } else {
            const formData = {
                shopName: shopName1,
                registration: registration1,
                ownerPhoneNo,
                ownerCnic,
                area: area1
            };

            console.log(shopName1);

            try {
                const jwtToken = await AsyncStorage.getItem("jwtToken");
                const response = await fetch(`${HostName}shops/edit-shop/${shopId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${jwtToken}`
                    },
                    method: "PATCH",
                    body: JSON.stringify(formData)
                });
                const data = await response.json();
                if (data.shop) {
                    Alert.alert("Success", `${data.message}`);
                }
            } catch (error) {
                Alert.alert("Failed!", `${error.message}`);
                console.log(error);
            }
        }
    };
    return (
        <ScrollView>
            <View style={styles.body}>
                <View style={styles.background}>
                    <Text style={styles.heading1}>Edit Shop Info</Text>
                </View>
                <View style={styles.background}>
                    <TextInput
                        placeholder="Shop Name"
                        style={ComonStyles.inputStyle1}
                        value={shopName}
                        defaultValue={shopData ? shopData.shopName : null}
                        inputMode="text"
                        onChangeText={(newValue) => setShopName(newValue)}
                        required
                    />
                    <TextInput
                        placeholder="Shop Registration No."
                        style={ComonStyles.inputStyle1}
                        value={registration}
                        inputMode="numeric"
                        defaultValue={shopData ? shopData.registration : null}
                        onChangeText={(newValue) => setRegistration(newValue)}
                        required
                    />
                    <TextInput
                        placeholder="Owner Phone No."
                        style={ComonStyles.inputStyle1}
                        value={number}
                        defaultValue={shopData ? shopData.ownerPhoneNo : null}
                        inputMode="numeric"
                        onChangeText={(newValue) => setNumber(newValue)}
                        required
                    />
                    <TextInput
                        placeholder="Owner Identity No."
                        style={ComonStyles.inputStyle1}
                        value={cnic}
                        defaultValue={shopData ? shopData.ownerCnic : null}
                        inputMode="numeric"
                        onChangeText={(newValue) => setCnic(newValue)}
                        required
                    />
                    <TextInput
                        placeholder="Shop Area"
                        style={ComonStyles.inputStyle1}
                        value={area}
                        inputMode="text"
                        defaultValue={shopData ? shopData.area : null}
                        onChangeText={(newValue) => setArea(newValue)}
                        required
                    />
                    <CustomButton
                        title={"Edit Shop"}
                        color={"#000"}
                        style={{ width: "80%", borderRadius: 10, margin: 10 }}
                        handleOnPress={submitShopData}
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
        justifyContent: "center",
        alignItems: "center",
    },
    background: {
        backgroundColor: "#fff",
        width: "95%",
        borderRadius: 10,
        boxShadow: "5px 5px",
        elevation: 20,
        shadowColor: "#777777bb",
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        padding: 5,
        justifyContent: "center",
        alignItems: "center",
        // justifyContent: 'center',
    },
    heading1: {
        fontSize: 30,
        fontWeight: 600,
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

export default EditShop;
