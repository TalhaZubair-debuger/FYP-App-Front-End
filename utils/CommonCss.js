import { StyleSheet } from "react-native";

const ComonStyles = StyleSheet.create({
    heading1:{
        fontSize: 60,
        fontWeight: 800,
        color: '#000',
        // alignItems:'flex-start'
        marginBottom: 50
    },
    heading3:{
        fontSize: 20,
        color: '#000',
    },
    inputStyle0:{
        width: '100%',
        height: 50,
        fontSize: 15,
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#000'
    },
    inputStyle1:{
        width: '80%',
        height: 50,
        margin: 10,
        fontSize: 15,
        padding: 10,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#000'
    },
    inputStyle2:{
        width: '50%',
        height: 50,
        // margin: 10,
        fontSize: 15,
        padding: 10,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#000'
    },
    buttonTransparent:{
        backgroundColor: '#fff',
        color: '#000'
    },
    notFound: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        textAlign: "center"
      },
      fontawesome: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      },
})
export default ComonStyles;