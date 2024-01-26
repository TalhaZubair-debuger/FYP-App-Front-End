import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { TextInput } from 'react-native'
import ComonStyles from '../../utils/CommonCss'
import { Picker } from '@react-native-picker/picker';
import { FlatList } from 'react-native';
import RecordsList from '../../utils/RecordsList';
import { SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HostName from '../../utils/HostName';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import CustomButton from '../../utils/CommonButton';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";


const ShopRecords = () => {
    const [productData, setProductData] = useState();
    const [quantity, setQuantity] = useState(null);
    const [description, setDescription] = useState(null);
    const [youGave, setYouGave] = useState(null);
    const [youGot, setYouGot] = useState(null);
    const [recordSendValue, setRecordSendValue] = useState("Send");
    const [record, setRecord] = useState();
    const [change, setChange] = useState(false);
    const [transactionId, setTransactionId] = useState();
    const route = useRoute();
    const shopId = route.params.shopId;
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
            sent: "",
            recieved: "3400"
        },
    ]
    useFocusEffect(
        useCallback(() => {
            fetchStockData();
            fetchShopRecordData();
            fetchMonthlyShopRecordData();
        }, [change])
    )
    const fetchStockData = async () => {
        try {
            const jwtToken = await AsyncStorage.getItem("jwtToken");
            const response = await fetch(`${HostName}products/products`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${jwtToken}`
                },
                method: "GET"
            })
            const Data = await response.json();
            setProductData(Data.products);
            setDescription(Data.products[0].productName)
        } catch (error) {
            console.log(error);
            Alert.alert(
                "Failure!", "No Products found"
            );
        }
    };
    const fetchShopRecordData = async () => {
        try {
            const jwtToken = await AsyncStorage.getItem("jwtToken");
            const response = await fetch(`${HostName}shop-records/get-records/${shopId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${jwtToken}`
                },
                method: "GET"
            })
            const Data = await response.json();

            if (Data.message) {
                Alert.alert(
                    "Failure!", "No Shop Record found!"
                );
            } else {
                setRecord(Data.records);
            }
        } catch (error) {
            console.log(error);
        }
    };
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
            console.log(Data);
        } catch (error) {
            console.log(error);
        }
    };
    const handleAddRecord = async () => {
        if (
            description === null ||
            recordSendValue === null
        ) {
            Alert.alert("Failure", "Please fill form completely");
        } else {
            if (recordSendValue === "Send") {
                const product = productData.filter(item => {
                    return item.productName === description
                })
                const formData = {
                    productName: product[0].productName,
                    quantity,
                    description,
                    youGave: product[0].price * parseInt(quantity),
                    youGot: null,
                    sent: true,
                    recieved: false
                }
                try {
                    const jwtToken = await AsyncStorage.getItem("jwtToken");
                    const response = await fetch(`${HostName}shop-records/add-records/${shopId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `${jwtToken}`
                        },
                        method: "POST",
                        body: JSON.stringify(formData)
                    });
                    const data = await response.json();
                    if (data) {
                        setChange(true)
                        Alert.alert("Alert", `${data.message}`);
                    }
                } catch (error) {
                    Alert.alert("Failed!", `${error.message}`);
                    console.log(error);
                }
            }
            else if (recordSendValue === "Recieve") {
                const product = productData.filter(item => {
                    return item.productName === description
                })
                const formData = {
                    productName: product[0].productName,//OK
                    quantity: null,
                    description,//OK
                    youGave: null,
                    youGot: youGot,//OK
                    sent: false,
                    recieved: true,//Ok
                    transactionId
                }
                try {
                    const jwtToken = await AsyncStorage.getItem("jwtToken");
                    const response = await fetch(`${HostName}shop-records/add-records/${shopId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `${jwtToken}`
                        },
                        method: "POST",
                        body: JSON.stringify(formData)
                    });
                    const data = await response.json();
                    if (data) {
                        setChange(true)
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
                    <Text style={[styles.font15, styles.green]}>Rs.{record ? record[0] ? record[0].totalRevenue : 0 : 0}</Text>
                    <Text>Total Revenue</Text>
                </View>
                <View style={styles.block33}>
                    <Text style={[styles.font15, styles.blue]}>Rs.{record ? record[0] ? parseInt(record[0].totalSent) : 0 : 0}</Text>
                    <Text>Total Sent</Text>
                </View>
                <View style={styles.block33}>
                    <Text style={[styles.font15, styles.red]}>Rs.{record ? record[0] ? parseInt(record[0].balance) : 0 : 0}</Text>
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
                        {/* <SafeAreaView> */}
                        {
                            record ?
                                record[0].records.map((item, index) => (
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
                        {/* </SafeAreaView> */}
                    </View>
                </ScrollView>
                <View style={styles.addRecords}>
                    {
                        recordSendValue === "Send" ?
                            <View>
                                <View style={styles.row}>
                                    <TextInput
                                        placeholder="Quantity"
                                        style={ComonStyles.inputStyle2}
                                        value={quantity}
                                        inputMode="numeric"
                                        onChangeText={(newValue) => setQuantity(newValue)}
                                        required
                                    />
                                    <View style={[styles.dropdown]}>
                                        <Picker
                                            selectedValue={recordSendValue}

                                            onValueChange={(recordSendValue) => setRecordSendValue(recordSendValue)}
                                        >
                                            <Picker.Item label="Send" value="Send" />
                                            <Picker.Item label="Recieve" value="Recieve" />
                                        </Picker>
                                    </View>
                                </View>
                                <View style={styles.row}>
                                    <View style={[styles.dropdown2]}>
                                        <Picker
                                            selectedValue={description}
                                            onValueChange={(value) => setDescription(value)}
                                        >
                                            {
                                                productData ?
                                                    productData.map(item => (
                                                        <Picker.Item key={item._id} label={item.productName} value={item.productName} />
                                                    ))
                                                    :
                                                    <Text>No Products</Text>
                                            }
                                        </Picker>
                                    </View>

                                    <CustomButton
                                        title={<FontAwesome5 name={"paper-plane"} size={20} color={"#fff"} />}
                                        color={"#000"}
                                        style={{ width: "20%", borderRadius: 10 }}
                                        handleOnPress={() => handleAddRecord()}
                                    />
                                </View>
                            </View>
                            :
                            <View>
                                <View style={styles.row}>
                                    <TextInput
                                        placeholder="Amount Recieved"
                                        style={ComonStyles.inputStyle2}
                                        value={youGot}
                                        inputMode="numeric"
                                        onChangeText={(newValue) => setYouGot(newValue)}
                                        required
                                    />
                                    <View style={[styles.dropdown]}>
                                        <Picker
                                            selectedValue={recordSendValue}
                                            onValueChange={(recordSendValue) => setRecordSendValue(recordSendValue)}
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
                                            selectedValue={description}
                                            onValueChange={(value) => setDescription(value)}
                                        >
                                            {
                                                productData ?
                                                    productData.map(item => (
                                                        <Picker.Item key={item._id} label={item.productName} value={item.productName} />
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
                                        handleOnPress={() => handleAddRecord()}
                                    />
                                </View>
                            </View>
                    }
                </View>
            </View>
        </View>
    )
}

export default ShopRecords

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
    font15: {
        fontSize: 15
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
    }

})