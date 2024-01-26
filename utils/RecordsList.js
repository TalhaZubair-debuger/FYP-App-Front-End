import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const RecordsList = ({ quantity,youGave,youGot, sent, recieved, description }) => {
    return (
        <View style={[styles.item, sent ? styles.lightred : styles.lightgreen]}>
            <View style={styles.block15}>
                <Text>{quantity ? quantity : null}</Text>
            </View>
            <View style={styles.block35}>
                <Text>{description ? description : null}</Text>
            </View>
            <View style={styles.block25}>
                <Text>{sent ? `Rs.${youGave}` : null}</Text>
            </View>
            <View style={styles.block25}>
            <Text>{recieved ? `Rs.${youGot}` : null}</Text>
            </View>
        </View>
    )
}

export default RecordsList

const styles = StyleSheet.create({
    lightgreen: {
        backgroundColor: '#90EE90'
    },
    lightred: {
        backgroundColor: '#FF7F7F'
    },
    block33: {
        width: "33%",
        justifyContent: "center",
        alignItems: "center",
        borderRightWidth: 1,
        borderColor: "black",
        height: "100%"
    },
    block35: {
        width: "35%",
        justifyContent: "center",
        alignItems: "center",
        borderRightWidth: 1,
        borderColor: "black",
        height: "100%"
    },
    block15: {
        width: "15%",
        justifyContent: "center",
        alignItems: "center",
        borderRightWidth: 1,
        borderColor: "black",
        height: "100%"
    },
    block25: {
        width: "25%",
        justifyContent: "center",
        alignItems: "center",
        borderRightWidth: 1,
        borderColor: "black",
        height: "100%"
    },
    item: {
        flex: 1,
        justifyContent: "space-between",
        alignItems:"center",
        flexDirection: "row",
        borderBottomColor: "#000",
        borderBottomWidth: 2,
        width: "100%",
        height: 80,
    },
    entry: {
        justifyContent: "flex-start",
        alignItems: "flex-start",
        padding: 5,
        width: "40%"
    },
    sent: {
        justifyContent: "center",
        alignItems: "flex-start",
        padding: 5,
        width: "30%",
        backgroundColor: "#CD1818",
        height: "100%"
    },
    recieved: {
        justifyContent: "center",
        alignItems: "flex-end",
        padding: 5,
        width: "30%",
        backgroundColor: "#116D6E",
        height: "100%"
    }
})