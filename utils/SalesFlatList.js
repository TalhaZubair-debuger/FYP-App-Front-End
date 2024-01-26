import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const SalesFlatList = ({ title }) => {
    return (
        <View style={styles.item}>
            <Text style={styles.title}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderRadius: 10,
        boxShadow: '5px 5px #777777bb',
        backgroundColor: '#dddddd55',
        marginBottom: 5,
        height: 60
    },
    title: {
        fontSize: 20,
        flex: 1,
        justifyContent: 'center',
        textAlign: 'left',
        marginLeft: 5 
    }
})
export default SalesFlatList