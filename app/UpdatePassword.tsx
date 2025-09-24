import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon, TextInput } from 'react-native-paper';

import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { router } from 'expo-router';
export default function UpdatePassword() {
    const { uid, accessToken } = useAuth();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const goBackHandler = () => { router.back() }

    const handleUpdatePassword = async() =>{
        const updateData = { userId: uid, currentPassword: oldPassword, newPassword };
        api.patch('/user/update-password', updateData,
            { headers: { Authorization: `Bearer ${accessToken}` } })
        .then((response) => {
            Alert.alert("Password updated successfully");
            router.replace('/(tabs)/Profile');
        })
        .catch((error) => {
            if(error.response.data === "Error updating password: [Current password is incorrect]"){
                Alert.alert("Current password is incorrect");
            }else{
                console.error('Error updating password:', error.message);
            }
        });
        
    };

    return(
        <View style={styles.container}>

            {/* Header with Back Button and Title */} 
            <View style={styles.header}>
                <TouchableOpacity onPress={goBackHandler} style={styles.backButton}>
                    <Icon source="arrow-left" size={24} color="#3c3c3cff" />
                </TouchableOpacity>
                <Text style={styles.profileTitle}>Update Password</Text>
            </View>


            <View style={styles.updatePasswordForm}>
                <TextInput mode="outlined" placeholder="Old Password" secureTextEntry={true} value={oldPassword} onChangeText={setOldPassword} style={styles.textInput} right={<TextInput.Icon icon="eye-off" />} outlineStyle={styles.textInputOutline}/>
                <TextInput mode="outlined" placeholder="New Password" secureTextEntry={true} value={newPassword} onChangeText={setNewPassword} style={styles.textInput} right={<TextInput.Icon icon="eye-off" />} outlineStyle={styles.textInputOutline}/>
                <TextInput mode="outlined" placeholder="Confirm Password" secureTextEntry={true} value={confirmPassword} onChangeText={setConfirmPassword} style={styles.textInput} right={<TextInput.Icon icon="eye-off" />} outlineStyle={styles.textInputOutline}/>
            </View>
            <View>
                <TouchableOpacity onPress={handleUpdatePassword} style={styles.updatePasswordButton}>
                    <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Update Password</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20,
        backgroundColor: '#ffffffff' 
    },
    header: {
        marginTop: 30,
        marginBottom: "30%",
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    profileTitle: {
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
    updatePasswordButton: { 
        backgroundColor: '#871919ff', 
        marginTop: 20, 
        height: 58, 
        borderRadius: 30, 
        justifyContent: 'center',
        alignItems: 'center' 
    },
    updatePasswordForm: {
        marginTop: 10,
    },
    textInput: { 
        marginBottom: 15, 
        backgroundColor: '#e8e8e8ff', 
        height: 58 
    },
    textInputOutline: { 
        borderRadius: 30, 
        borderWidth: 0 
    },
});