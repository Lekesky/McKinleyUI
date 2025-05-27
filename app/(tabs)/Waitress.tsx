import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import React from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useTable } from '../../context/TableContext';




export default function WaitressScreen() {
    const { tableNum, setTableNum } = useTable()



    const handleEnter = (num : string) => {
        if(num !== ''){
            console.log("Table Number: ", num);
            setTableNum(num);
            router.replace("/WaitressMenu");
        }else{
            Alert.alert("Please select a table number.");
            console.log("Missing table number.");
        }
        
    }

    return (
        <View style = {styles.container}>
            <View style = {styles.box}>
                <Text style = {styles.title}>Take Order</Text>
            </View>
            <View style={styles.tableBox}>
                <Text style = {styles.tableNum} >Table Number:</Text>
                <Picker
                        selectedValue={tableNum}
                        style={styles.picker}
                        onValueChange={(itemValue) => setTableNum(itemValue)}>
                        <Picker.Item label="Select Table" value="" />
                        <Picker.Item label="Table 1" value="1" />
                        <Picker.Item label="Table 2" value="2" />
                        <Picker.Item label="Table 3" value="3" />
                        <Picker.Item label="Table 4" value="4" />
                        <Picker.Item label="Table 5" value="5" />
                        <Picker.Item label="Table 6" value="6" />
                        <Picker.Item label="Table 7" value="7" />
                        <Picker.Item label="Table 8" value="8" />
                        <Picker.Item label="Table 9" value="9" />
                        <Picker.Item label="Table 10" value="10" />
                        <Picker.Item label="Table 11" value="11" />
                        <Picker.Item label="Table 12" value="12" />
                </Picker>
            </View>
            <View style={styles.enterBox}>
                <TouchableOpacity onPress = {() => handleEnter(tableNum)}>
                    <Text style={styles.enterBoxStyle}>Enter</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
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
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
});
