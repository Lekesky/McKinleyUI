import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffffff',
    },
    header: {
        marginTop: 30,
        marginBottom: "10%",
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    headerTitle: {
        fontSize: 24,
        color: '#871919ff',
        fontWeight: 'bold',
        fontFamily: 'Helvetica',
    },
    backButton: { 
        backgroundColor: '#e8e8e8ff', 
        width: 50, 
        height: 50, 
        borderRadius: 25, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    orderList: {
        paddingBottom: 20,
    },
    emptyMessage: {
        textAlign: 'center',
        fontSize: 16,
        color: '#7e7d7dff',
        fontWeight: 'bold',
        fontFamily: 'Helvetica',
    },
});

export default styles;