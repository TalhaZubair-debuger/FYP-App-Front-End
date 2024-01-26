import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { TextInput } from 'react-native'
import ComonStyles from '../../utils/CommonCss'
import { Picker } from '@react-native-picker/picker';
import { FlatList } from 'react-native';
import RecordsList from '../../utils/RecordsList';
import { SafeAreaView } from 'react-native';
import CustomButton from '../../utils/CommonButton';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useFocusEffect, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HostName from '../../utils/HostName';
import { Alert } from 'react-native';


const VendorRecords = () => {
    const [recordSendValue, setRecordSendValue] = useState("Send");
    const [quantity, setQuantity] = useState();
    const [productData, setProductData] = useState(null);
    const [description, setDescription] = useState();
    const [youGot, setYouGot] = useState();
    const [youGave, setYouGave] = useState();
    const [product, setProduct] = useState(null);
    const [msgSendValue, setMsgSendValue] = useState("Send");
    const [vendorData, setVendorData] = useState();
    const [VendorRecords, setVendorRecords] = useState();
    const [venderBalanceData, setVenderBalanceData] = useState();
    const [transactionId, setTransactionId] = useState("");
    const [change, setChange] = useState(false);
    const route = useRoute();
    const vendorId = route.params.vendorId;
    const data = [
        {
            id: 1,
            entryMessage: "200 Handfrees",
            entryDate: "30th March, 23",
            sent: "7000",
            recieved: ""
        },
        {
            id: 2,
            entryMessage: "50 C-Type cables",
            entryDate: "25th Sept, 23",
            sent: "2000",
            recieved: "3400"
        },
    ];


    useFocusEffect(
        useCallback(() => {
            getVendorData();
            getVendorRecords();
        }, [])
    )
    const getVendorData = async () => {
        try {
            const jwtToken = await AsyncStorage.getItem("jwtToken");
            const response = await fetch(`${HostName}vendors/vendor/${vendorId}`, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `${jwtToken}`
                },
                method: "GET"
            })
            const data = await response.json();
            if (!data.vendor) {
                Alert.alert("Failure!", `${data.message}`);
            }
            else {
                console.log(data.vendor);
                setVendorData(data.vendor);
            }
        } catch (error) {
            Alert.alert("Failed!", `${error.message}`);
            console.log(error);
        }
    }
    const getVendorRecords = async () => {
        try {
            const jwtToken = await AsyncStorage.getItem("jwtToken");
            const response = await fetch(`${HostName}vendor-records/get-records/${vendorId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${jwtToken}`
                },
                method: "GET"
            })
            const Data = await response.json();

            if (Data.message) {
                Alert.alert(
                    "Failure!", Data.message
                );
            } else {
                setVendorRecords(Data.records[0].records);
                setVenderBalanceData(Data.records[0]);
                getVendorData();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleAddRecord = async () => {
        if (recordSendValue === null || product === null) {
            Alert.alert("Failure", "Please fill form completely");
        } else {
            if (recordSendValue === "Send") {
                const Product = vendorData.vendorProducts.filter(item => {
                    return item.productName == product
                })
                // console.log(Product[0].productName+"113");
                const formData = {
                    productName: Product[0].productName,
                    quantity: null,
                    youGave: youGave,
                    youGot: null,
                    sent: true,
                    recieved: false,
                    transactionId
                }
                try {
                    const jwtToken = await AsyncStorage.getItem("jwtToken");
                    const response = await fetch(`${HostName}vendor-records/add-records/${vendorId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `${jwtToken}`
                        },
                        method: "POST",
                        body: JSON.stringify(formData)
                    });
                    const data = await response.json();
                    console.log("2");
                    if (data) {
                        console.log(data.records);
                        // setVendorData(data.records)
                        Alert.alert("Alert", `${data.message}`);
                    }
                } catch (error) {
                    Alert.alert("Failed!", `${error.message}`);
                    console.log(error);
                }
            }
            else if (recordSendValue === "Recieve") {
                try {
                    const Product = vendorData.vendorProducts.filter(item => {
                        return item.productName == product
                    })
                    console.log(Product);
                    const formData = {
                        productName: Product[0].productName,
                        quantity: youGot,
                        youGave: null,
                        youGot: parseInt(Product[0].productPrice) * parseInt(youGot),
                        sent: false,
                        recieved: true
                    }
                    const jwtToken = await AsyncStorage.getItem("jwtToken");
                    const response = await fetch(`${HostName}vendor-records/add-records/${vendorId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `${jwtToken}`
                        },
                        method: "POST",
                        body: JSON.stringify(formData)
                    });
                    const data = await response.json();
                    if (data) {
                        console.log(data.records);
                        Alert.alert("Alert", `${data.message}`);
                    }
                } catch (error) {
                    Alert.alert("Failed!", `${error.message}`);
                    console.log(error);
                }
            }
        }
    }
    return (
        <View style={styles.body}>
            <View style={[styles.row, styles.bgColor]}>
                <View style={styles.block33}>
                    <Text style={[styles.font15, styles.blue]}>Rs.{venderBalanceData ? venderBalanceData.totalSent : 0}</Text>
                    <Text>Total Sent</Text>
                </View>
                <View style={styles.block33}>
                    <Text style={[styles.font15, styles.red]}>Rs.{venderBalanceData ? venderBalanceData.balance : 0}</Text>
                    <Text>Balance</Text>
                </View>
            </View>
            <View style={[styles.row, styles.bgcolor]}>
                <View style={styles.block15}>
                    <Text>Quantity</Text>
                </View>
                <View style={styles.block35}>
                    <Text>Description</Text>
                </View>
                <View style={styles.block25}>
                    <Text>You gave</Text>
                </View>
                <View style={styles.block25}>
                    <Text>You got</Text>
                </View>
            </View>
            <View style={styles.records}>
                <ScrollView>
                    <View style={styles.chatContainer}>
                        {
                            VendorRecords ?
                                VendorRecords.map((item, index) => (
                                    <RecordsList
                                        quantity={item.quantity}
                                        description={item.description}
                                        youGave={item.youGave}
                                        youGot={item.youGot}
                                        sent={item.sent}
                                        recieved={item.recieved}
                                        key={index}
                                    />
                                ))
                                :
                                null
                        }
                    </View>
                </ScrollView>
                <View style={styles.addRecords}>
                    {
                        recordSendValue === "Send" ?
                            <View>
                                <View style={styles.row}>
                                    <TextInput
                                        placeholder="Amount Sent"
                                        style={ComonStyles.inputStyle2}
                                        value={youGave}
                                        inputMode="numeric"
                                        onChangeText={(newValue) => setYouGave(newValue)}
                                        required
                                    />
                                    <View style={[styles.dropdown]}>
                                        <Picker
                                            selectedValue={recordSendValue}
                                            onValueChange={(value) => setRecordSendValue(value)}
                                        >
                                            <Picker.Item label="Send" value="Send" />
                                            <Picker.Item label="Recieve" value="Recieve" />
                                        </Picker>
                                    </View>
                                </View>
                                <View style={styles.row}>
                                    <TextInput
                                        placeholder="Bank Transaction ID"
                                        style={ComonStyles.inputStyle0}
                                        value={transactionId}
                                        inputMode="text"
                                        onChangeText={(newValue) => setTransactionId(newValue)}
                                        required
                                    />
                                </View>
                                <View style={styles.row}>
                                    <View style={styles.dropdown2}>
                                        <Picker
                                            value={product}
                                            selectedValue={product}
                                            onValueChange={(value) => setProduct(value)}
                                        >
                                            {
                                                vendorData ?
                                                    vendorData.vendorProducts.map(item => (
                                                        <Picker.Item key={item.productPrice} label={item.productName} value={item.productName} />
                                                    ))
                                                    :
                                                    <Text>No Products</Text>
                                            }
                                        </Picker>
                                    </View>
                                    <CustomButton
                                        title={<FontAwesome5 name={"paper-plane"} size={20} color={"#fff"} />}
                                        color={"#000"}
                                        style={{ width: "20%", borderRadius: 10, marginVertical: 5 }}
                                        handleOnPress={handleAddRecord}
                                    />
                                </View>
                            </View>
                            :
                            <View>
                                <View style={styles.row}>
                                    <TextInput
                                        placeholder="Items Recieved"
                                        style={ComonStyles.inputStyle2}
                                        value={youGot}
                                        inputMode="numeric"
                                        onChangeText={(newValue) => setYouGot(newValue)}
                                        required
                                    />
                                    <View style={[styles.dropdown]}>
                                        <Picker
                                            selectedValue={recordSendValue}
                                            onValueChange={(value) => setRecordSendValue(value)}
                                        >
                                            <Picker.Item label="Send" value="Send" />
                                            <Picker.Item label="Recieve" value="Recieve" />
                                        </Picker>
                                    </View>
                                </View>
                                <View style={styles.row}>
                                    <View style={styles.dropdown2}>
                                        <Picker
                                            value={product}
                                            selectedValue={product}
                                            onValueChange={(value) => setProduct(value)}
                                        >
                                            {
                                                vendorData ?
                                                    vendorData.vendorProducts.map(item => (
                                                        <Picker.Item key={item.productPrice} label={item.productName} value={item.productName} />
                                                    ))
                                                    :
                                                    <Text>No Products</Text>
                                            }
                                        </Picker>
                                    </View>
                                    <CustomButton
                                        title={<FontAwesome5 name={"paper-plane"} size={20} color={"#fff"} />}
                                        color={"#000"}
                                        style={{ width: "20%", borderRadius: 10, marginVertical: 5 }}
                                        handleOnPress={handleAddRecord}
                                    />
                                </View>
                            </View>
                    }
                </View>
            </View>
        </View>
    )
}

export default VendorRecords

const styles = StyleSheet.create({
    block33: {
        width: "33%",
        justifyContent: "center",
        alignItems: "center"
    },
    block35: {
        width: "35%",
        justifyContent: "center",
        alignItems: "center"
    },
    block15: {
        width: "15%",
        justifyContent: "center",
        alignItems: "center"
    },
    block25: {
        width: "25%",
        justifyContent: "center",
        alignItems: "center"
    },
    body: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    bgColor: {
        height: 70,
        backgroundColor: "lightgrey",
        width: "100%"
    },
    bgcolor: {
        height: 30,
        backgroundColor: "grey",
        width: "100%"
    },
    font20: {
        fontSize: 20
    },
    red: {
        color: "red"
    },
    blue: {
        color: "blue"
    },
    green: {
        color: "green"
    },
    chat: {
        padding: 5
    },
    sent: {
        borderColor: "red",
        borderWidth: 2,
        right: -5
    },
    recieved: {
        borderColor: "green",
        borderWidth: 2,
        left: "-5%"
    },
    dropdown: {
        borderWidth: 2,
        borderColor: "#000",
        width: "40%",
        color: "#000",
        borderColor: "#000",
        borderRadius: 10,
        height: 50,
        justifyContent: "center"
    },
    dropdown2: {
        borderWidth: 2,
        borderColor: "#000",
        width: "75%",
        color: "#000",
        borderColor: "#000",
        borderRadius: 10,
        height: 50,
        justifyContent: "center",
        marginVertical: 5
    },
    addRecords: {
        position: 'absolute',
        bottom: 0,
        // left: 0,
        // right: 0,
        padding: 5,
        backgroundColor: "lightgrey",
        width: "100%"
    },
    records: {
        flex: 1,
        width: "100%"
    },
    totalRevenue: {
        width: "30%"
    }

})