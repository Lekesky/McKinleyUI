import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffffff',
        borderWidth: 1,
    },
    header: {
        marginTop: 30,
        marginBottom: "1%",
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
    checkoutButton: { 
        backgroundColor: '#871919ff', 
        marginTop: 20, 
        height: 58, 
        borderRadius: 30, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    summary: {
        flexDirection: 'column',
        gap: 10,
        marginBottom: 20,
        backgroundColor: '#F0F0F0',
        padding: 20,
        borderRadius: 10,
    },
    summaryColumn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    menuItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 90,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
    },
    menuItemImageContainer: {
      // borderWidth: 1,
      width: "auto",
      height: "100%",
      justifyContent: 'center',
      alignItems: 'center',
      flex: 2,
    },
    menuItemDetailsContainer: {
      // borderWidth: 1,
      paddingLeft: 10,
      flex: 8,
      flexDirection: 'column',
      height: "100%",
    },
    menuItemPriceContainer: {
      // borderWidth: 1,
      height: "100%",
      justifyContent: 'center',
      width: 55,
    },
    quantityPriceContainer: {
      flexDirection: 'row',
      gap: 45,
      alignItems: 'center',
      // borderWidth: 1,
    },
    menuItemImage: {
      width: "100%",
      height: "100%",
      borderRadius: 25,
    },
    menuItemName: {
      // borderWidth: 1,
      justifyContent: 'center',
      flex: 3,
    },
    quantityPrice: {
      // borderWidth: 1,
      width: 85,
      justifyContent: 'center',
    },
    price: {
      
    },
    plusMinusButton: {
      backgroundColor: '#871919ff', 
      width: 30, 
      height: 30,
      borderRadius: 15, 
      justifyContent: 'center', 
      alignItems: 'center',
    },
    enterBoxStyle: {
        backgroundColor: "#53c851",
        color: "white",
        textAlign: "center",
        textAlignVertical: "center",
        fontSize: 20,
        height: 35,
        width: "auto",
        borderRadius: 20,
    },
    picker: {
        borderWidth: 2,
        height: 50,
        width: 150,
        marginLeft: 10,
    },
    textBox: {
        marginLeft: 15,
        borderWidth: 2,
        width: 50,
        height: 50,
        alignSelf: "center",
    },
    tableNum: {
        fontSize: 30,
    },
    tableBox: {
        flexDirection: 'row',
    },
    enterBox: {
        marginTop: 30,
        width: 350,
    },
    box: {
        padding: 20,
        borderRadius: 8,
    },
    title: {
        textAlign: "center",
        fontSize: 60,
        fontWeight: 'bold',
        alignItems: "center"
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    waitressContainer: {
      flex: 1,
      alignItems: 'center',
      paddingTop: 20,
    },
    waitressTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#871919ff',
      marginBottom: 30,
      fontFamily: 'Helvetica',
    },
    tableLayout: {
      width: '100%',
      marginVertical: 20,
      alignItems: 'center',
    },
    tableRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 15,
    },
    tableButton: {
      width: 70,
      height: 70,
      borderRadius: 10,
      backgroundColor: '#f0f0f0',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 10,
      borderWidth: 1,
      borderColor: '#d0d0d0',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    selectedTableButton: {
      backgroundColor: '#871919ff',
      borderColor: '#700000',
    },
    tableButtonText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
    },
    selectedTableText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 15,
    },
    selectedTableInfo: {
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    takeOrderButton: {
      backgroundColor: '#871919ff',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 60,
      width: 220,
      borderRadius: 30,
      marginTop: 20,
    },
    disabledButton: {
      backgroundColor: '#cccccc',
    },
    buttonIcon: {
      marginRight: 10,
    },
    takeOrderButtonText: {
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: 18,
    },
    tableNumber: {
      fontSize: 28,
      fontWeight: '900',
      color: '#871919ff',
      letterSpacing: 0.5,
      textShadowColor: 'rgba(135, 25, 25, 0.2)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    headerInfo: {
      flexDirection: 'column',
      justifyContent: 'center',
      marginLeft: 5,
    },
});

export default styles;