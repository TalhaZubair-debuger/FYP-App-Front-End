import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useFocusEffect, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HostName from '../../utils/HostName';
import CommonButton from '../../utils/CommonButton';
import { Modal } from 'react-native';
import { TextInput } from 'react-native';
import CommonCss from '../../utils/CommonCss';
import { Picker } from '@react-native-picker/picker';

const Employee = ({ navigation }) => {
    const [employeeData, setEmployeeData] = useState();
    const [employeeName, setEmployeeName] = useState("");
    const [employeeEmail, setEmployeeEmail] = useState("");
    const [employeeType, setEmployeeType] = useState("KPO");
    const [area, setArea] = useState("");
    const [employeeContact, setEmployeeContact] = useState(null);
    const [modalEditProductVisible, setModalEditProductVisible] = useState(false);
    const route = useRoute();
    const employeeId = route.params.employeeId;

    useFocusEffect(
        useCallback(() => {
            getProductData();
        }, [modalEditProductVisible])
    )
    const getProductData = async () => {
        try {
            const jwtToken = await AsyncStorage.getItem("jwtToken");
            const response = await fetch(`${HostName}employees/get-employee/${employeeId}`, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `${jwtToken}`
                },
                method: "GET"
            })
            const data = await response.json();
            if (!data.employee) {
                Alert.alert("Failure!", `${data.message}`);
            }
            else {
                setEmployeeData(data.employee);
            }
        } catch (error) {
            Alert.alert("Failed!", `${error.message}`);
            console.log(error);
        }
    }

    const handleUpdateProductDetails = async () => {
        if (
            employeeName === "" ||
            employeeEmail === "" ||
            employeeType === "" ||
            employeeContact === null
        ) {
            Alert.alert("Failure", "Please fill form completely");
        } else {
            let formData;
            if (area != "") {
                formData = {
                    name: employeeName,
                    email: employeeEmail,
                    designation: employeeType,
                    area,
                    contact: employeeContact
                };
            }
            else {
                formData = {
                    name: employeeName,
                    email: employeeEmail,
                    designation: employeeType,
                    contact: employeeContact
                };
            }

            try {
                const jwtToken = await AsyncStorage.getItem("jwtToken");
                const response = await fetch(`${HostName}employees/edit-employee/${employeeId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${jwtToken}`
                    },
                    method: "PATCH",
                    body: JSON.stringify(formData)
                });
                const data = await response.json();
                if (data.message) {
                    setEmployeeName("");
                    setEmployeeContact(null);
                    setEmployeeEmail("");
                    setEmployeeType("");
                    setModalEditProductVisible(!modalEditProductVisible);
                    Alert.alert("Alert!", `${data.message}`);
                }
            } catch (error) {
                Alert.alert("Failed!", `${error.message}`);
                console.log(error);
            }
        }
    }

    const handleDelete = async () => {
        try {
            const jwtToken = await AsyncStorage.getItem("jwtToken");
            const response = await fetch(`${HostName}employees/delete-employee/${employeeId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${jwtToken}`
                },
                method: "DELETE"
            })
            const Data = await response.json();
            Alert.alert("Success", `${Data.message}`);
            navigation.navigate("All Employees");
        } catch (error) {
            console.log(error);
            Alert.alert(
                "Failure", "Failed to delete shop."
            );
        }
    }

    return (
        <View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalEditProductVisible}
                onRequestClose={() => {
                    setModalEditProductVisible(!modalEditProductVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.headingFlatlist}>
                        <Text style={styles.head}>Edit Employee Details</Text>
                    </View>
                    <TextInput
                        placeholder="Employee Name"
                        style={CommonCss.inputStyle1}
                        value={employeeName}
                        inputMode="text"
                        onChangeText={(newValue) => setEmployeeName(newValue)}
                        required
                    />
                    <TextInput
                        placeholder="Employee Email"
                        style={CommonCss.inputStyle1}
                        value={employeeEmail}
                        inputMode="text"
                        onChangeText={(newValue) => setEmployeeEmail(newValue)}
                        required
                    />

                    <TextInput
                        placeholder="Employee Contact"
                        style={CommonCss.inputStyle1}
                        value={employeeContact}
                        inputMode="numeric"
                        onChangeText={(newValue) => setEmployeeContact(newValue)}
                        required
                    />

                    <View style={[styles.dropdown2]}>
                        <Picker
                            selectedValue={employeeType}
                            onValueChange={(value) => setEmployeeType(value)}
                        >
                            <Picker.Item label="KPO" value="KPO" />
                            <Picker.Item label="Salesman" value="Salesman" />
                        </Picker>
                    </View>
                    {
                        employeeType === "Salesman" ?
                            <>
                                <View>
                                    <Text>
                                        Salesman Area
                                    </Text>
                                </View>
                                <View style={[styles.dropdown2]}>
                                    <Picker
                                        selectedValue={area}
                                        onValueChange={(value) => setArea(value)}
                                    >
                                        <Picker.Item label="chungg" value="chungg" />
                                        <Picker.Item label="thokar" value="thokar" />
                                    </Picker>
                                </View>
                            </>
                            :
                            <></>
                    }
                    <CommonButton
                        title={"Update Employee"}
                        color={"#000"}
                        style={{ width: "80%", borderRadius: 10, margin: 10, fontSize: 5 }}
                        handleOnPress={handleUpdateProductDetails}
                    />
                </View>
            </Modal>

            <View style={styles.flatlist}>
                <View style={styles.headingFlatlist}>
                    <Text style={styles.head}>Employee</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.bold}>Employee Name: </Text>
                    <Text>{employeeData ? employeeData.name : null}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.bold}>Employee Email: </Text>
                    <Text>{employeeData ? employeeData.email : null}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.bold}>Employee Contact: </Text>
                    <Text>{employeeData ? employeeData.contact : null}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.bold}>Employee Designation: </Text>
                    <Text>{employeeData ? employeeData.designation : null}</Text>
                </View>
                {
                    employeeData ?
                        employeeData.area ?
                            <View style={styles.row}>
                                <Text style={styles.bold}>Area: </Text>
                                <Text>{employeeData ? employeeData.area : null}</Text>
                            </View>
                            : <></>
                        : <></>
                }
            </View>

            <View style={styles.flatlist}>
                <CommonButton
                    title={"Edit Employee Info"}
                    color={"#000"}
                    style={{ width: "95%", borderRadius: 10, margin: 10, fontSize: 10 }}
                    handleOnPress={() => setModalEditProductVisible(!modalEditProductVisible)}
                />
            </View>

            <View style={styles.flatlist}>
                <CommonButton
                    title={"Delete Employee"}
                    color={"red"}
                    style={{ width: "95%", borderRadius: 10, margin: 10, fontSize: 10 }}
                    handleOnPress={handleDelete}
                />
            </View>
        </View>
    )
}

export default Employee

const styles = StyleSheet.create({
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
    },
    headingFlatlist: {
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        margin: 10,
    },
    head: {
        fontSize: 30,
        fontWeight: 600,
        textAlign: "center"
    },
    row: {
        flexDirection: "row",
        justifyContent: "flex-start", // Aligns the boxes to the top right corner
    },
    bold: {
        fontWeight: "600"
    },

    centeredView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 200,
        marginHorizontal: 10,
        backgroundColor: "#fff",
        padding: 5,
        elevation: 50,
        shadowColor: "#000",
        borderRadius: 10,
        shadowRadius: 20,
        borderColor: "#000",
        borderWidth: 1
    },
    dropdown2: {
        borderWidth: 2,
        borderColor: "#000",
        width: "80%",
        color: "#000",
        borderColor: "#000",
        borderRadius: 10,
        height: 50,
        justifyContent: "center",
        marginVertical: 5
    },
})