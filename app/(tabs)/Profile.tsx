import { deleteUser, EmailAuthProvider, getAuth, reauthenticateWithCredential, signOut } from "@react-native-firebase/auth";
import { router } from "expo-router";
import { useState } from 'react';
import { Alert, Button, StyleSheet, View } from "react-native";
import Dialog from "react-native-dialog";

export default function Profile() {
    const [password, setPassword] = useState('');
    const [visible, setVisible] = useState(false);
    const profileSettings = async() => {
    }



    const handleLogout = async() => {
        signOut(getAuth()).then(() => {
            Alert.alert("Sucessfully logged out.");
            console.log("Sucessfully logged user out.");  
        }).catch((error) => {
            Alert.alert("Error logging out account.")
            console.log("Error logging out user's account");
        });
    }

    const handleUpdatePassword = async() => {
        router.push('/UpdatePassword');
    }

    const handleDeleteAccount = async() =>{
        let user = await getAuth().currentUser;
        if(user){
            const credentials = EmailAuthProvider.credential(user.email, password)
            reauthenticateWithCredential(user, credentials).then(() =>{
                deleteUser(user).then(() => {
                    Alert.alert("Sucessfully delete account.");
                    console.log("Sucessfully delete user account: ", user);  
                }).catch((error) => {
                    Alert.alert("Error delete account.")
                    console.log("Error delete user account: ", user, "\nError: ", error);
                });
            }).catch((error: any) => {
                console.log("An error has occurred: ", error);
            })
        }
    }

    const handleDialogCancel = () => {
        setVisible(false);
    };

    const handleDialogDelete = () => {
        handleDeleteAccount();
        setPassword("");
        setVisible(false);
    };

    const displayDialog = () => {
        setVisible(true);
    };



    return (
       <View style={styles.actions}>
        <Dialog.Container visible = {visible}>
            <Dialog.Title>Delete Account Confirmation</Dialog.Title>
            <Dialog.Description>
                Please reenter your password to confirm account deletion
            </Dialog.Description>
            <Dialog.Input placeholder = "Password" value = {password} onChangeText={setPassword}/>
            <Dialog.Button label="Cancel" onPress = {handleDialogCancel}/>
            <Dialog.Button label="Delete" onPress = {handleDialogDelete}/>
        </Dialog.Container>
            <Button title="Logout" onPress = {handleLogout} />
            <Button title="Update Password" onPress = {handleUpdatePassword}/>
            <Button title="Delete Account" color = "red" onPress = {displayDialog} />
        </View> 
    );
}


const styles = StyleSheet.create({
    actions: {
        marginTop: 500,
        gap: 10,
      }
});