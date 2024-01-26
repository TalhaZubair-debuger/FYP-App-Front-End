import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { FlatList } from 'react-native'
import ComonStyles from '../../utils/CommonCss'
import EmployeeList from '../../utils/EmployeeList'
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import HostName from '../../utils/HostName'

const AllEmployees = ({navigation}) => {
    const [data, setData] = useState("");
    useFocusEffect(
        useCallback(() => {
          fetchEmployees()
        }, [])
      )
      const fetchEmployees = async () => {
        try {
            const jwtToken = await AsyncStorage.getItem("jwtToken");
            const response = await fetch(`${HostName}employees/get-all-employees`, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `${jwtToken}`
              },
              method: "GET"
            })
            const Data = await response.json();
            setData(Data.employees);
          } catch (error) {
            console.log(error);
            Alert.alert(
              "Failure", "Failed to fetch Employee Data"
            );
          }
      }
    return (
        <View>
            <View style={styles.flatlist}>
                <View style={styles.headingFlatlist}>
                    <Text style={styles.head}>All Employees</Text>
                </View>

                {
                    data ?
                        <SafeAreaView>
                            <FlatList
                                data={data}
                                renderItem={({ item }) => <EmployeeList
                                employeeId={item._id}
                                    employeeName={item.name}
                                    employeeDesignation={item.designation}
                                    navigation={navigation} />}
                                keyExtractor={item => item._id}
                            />
                        </SafeAreaView>
                        :
                        <Text style={ComonStyles.notFound}>No Employees Found</Text>
                }

            </View>
        </View>
    )
}

export default AllEmployees

const styles = StyleSheet.create({
    flatlist: {
        backgroundColor: "#fff",
        width: "95%",
        borderRadius: 10,
        boxShadow: "5px 5px",
        elevation: 20,
        shadowColor: "#777777bb",
        margin: 5,
        padding: 5,
    },
    headingFlatlist: {
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        margin: 10,
    },
    head: {
        fontSize: 20,
        fontWeight: 600,
    },
})