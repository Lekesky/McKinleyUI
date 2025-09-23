import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
export default function UpdatePassword() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleUpdatePassword = async() =>{
        
    };

    return(
        <View>
            <Text>Update Password</Text>
            <TextInput placeholder = "Old Password" value = {oldPassword} onChangeText = {setOldPassword} />
            <TextInput placeholder = "New Password" value = {newPassword} onChangeText = {setNewPassword} />
            <TextInput placeholder = "Confirm Password" value = {confirmPassword} onChangeText = {setConfirmPassword} />
            <Button title = "Update Password" onPress = {handleUpdatePassword} />
        </View>
    );
}
