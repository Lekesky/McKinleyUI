import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword } from '@react-native-firebase/auth';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
export default function UpdatePassword() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleUpdatePassword = async() =>{
        const user = getAuth().currentUser
        
        if(!user){
            return;
        }
        const credentials = EmailAuthProvider.credential(user.email, oldPassword);

        reauthenticateWithCredential(user, credentials).then(() =>{
            updatePassword(user, newPassword).then(() => {
                router.replace('/(tabs)/Profile');
                console.log("User password has been updated!");
                Alert.alert("User password has been updated!");
            }).catch((error) => {
                console.log("Error updating password: ", error);
                Alert.alert("Error updating password.");
            });
        }).catch((error) => {
            console.log("Error reauthenticating user with credentials: ", error);
            Alert.alert("Error checking reauthenticating");
        });
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
