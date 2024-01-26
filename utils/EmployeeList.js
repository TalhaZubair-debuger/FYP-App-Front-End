import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'

const EmployeeList = ({ employeeName, employeeDesignation, employeeId, navigation }) => {
  return (
    <TouchableOpacity onPress={() => { navigation.navigate("Employee", {employeeId: employeeId}) }}>
      <View style={styles.item}>
        <Text style={styles.titleBold}>{employeeName}</Text>
        <Text style={styles.title}>{employeeDesignation}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default EmployeeList

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    borderRadius: 10,
    boxShadow: "5px 5px #777777bb",
    backgroundColor: "#dddddd55",
    marginBottom: 5,
    height: 60,
  },
  title: {
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    textAlign: "center",
    fontSize: 15,
  },
  titleBold: {
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600"
  },
})