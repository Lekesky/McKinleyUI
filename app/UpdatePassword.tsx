import { useAuth } from '@/context/AuthContext';
import createAPIClient from '@/services/api';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { Icon, TextInput } from 'react-native-paper';
import styles from '../styles/UpdatePassword.styles';

export default function UpdatePassword() {
    const { uid } = useAuth();
    const api = useMemo(() => createAPIClient(), []);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const goBackHandler = () => { router.back() }

    const handleUpdatePassword = async() =>{
        const updateData = { userId: uid, currentPassword: oldPassword, newPassword };
        api.patch('/user/update-password', updateData)
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

