import { useAuth } from "@/context/AuthContext";
import { useTabBar } from "@/context/TabBarContext";
import createAPIClient from "@/services/api";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Button, Dialog, Icon, PaperProvider, Portal, Text } from "react-native-paper";
import styles from "../../styles/Profile.styles";

export default function Profile() {
    const { accessToken, refreshToken, logout, uid } = useAuth();
    const { hideTabBar, showTabBar } = useTabBar();
    const api = useMemo(() => createAPIClient(), []);
    const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [timeCreated, setTimeCreated] = useState(new Date());


    useEffect(() => {
        api.get(`/user/${uid}`)
            .then((res) => {
                setFirstName(res.data.firstName)
                setLastName(res.data.lastName)
                setEmail(res.data.email)
                setTimeCreated(new Date(res.data.timeCreated));
            })
            .catch((error) => console.error(`Error fetching user details for: `, error.message));
    },[api, uid, accessToken]);
    
    // Ensure tab bar is shown when component unmounts
    useEffect(() => {
        return () => {
            showTabBar();
        };
    }, [showTabBar]);

    const showLogoutDialog = () => {
        setLogoutDialogVisible(true);
        hideTabBar();
    };
    const hideLogoutDialog = () => {
        setLogoutDialogVisible(false);
        showTabBar();
    };
    const showDeleteDialog = () => {
        setDeleteDialogVisible(true);
        hideTabBar();
    };
    const hideDeleteDialog = () => {
        setDeleteDialogVisible(false);
        showTabBar();
    };

    const goBackHandler = () => { router.back() }
    const handleEditProfile = () => { router.push('/EditProfile') }
    const handleUpdatePassword = () => { router.push('/UpdatePassword') }
    const handleOrderHistory = () => { router.push('/OrderHistory')}
    const handleAdminView = () => { router.push('/Admin')}

    const handlePaymentMethods = () => {
        console.log("Payment methods logic here");
    }

    const handleDeleteAccount = () => {
        //Need to add password confirmation before allowing deletion
        hideDeleteDialog();
        api.delete(`/user/${uid}`)
            .then(async (res) => {
                if (res.status === 200) {
                    await logout();
                    console.log("Account deleted successfully");
                    router.replace('/Intro');
                }
            })
            .catch((error) => {
                console.error("Error deleting account: ", error);
            });
    }


    const handleLogout = () => {
        hideLogoutDialog();
        api.post('/user/logout', { refreshToken: refreshToken })
        .then(async (res) => {
            if(res.status === 200){
                await logout(); // Clear tokens from context and secure storage
                console.log("Logged out successfully");
                router.replace('/Intro');
            }
        }).catch((error) => {
            console.error("Error during logout: ", error);
        });
    }

    return (
        <PaperProvider>
            <View style={styles.container}>
                <Portal>
                    <Dialog visible={logoutDialogVisible} onDismiss={hideLogoutDialog}>
                        <Dialog.Title>Confirm Logout?</Dialog.Title>
                        <Dialog.Content><Text variant="bodyMedium">Are you sure you want to log out?</Text></Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={hideLogoutDialog}>Cancel</Button>
                            <Button onPress={handleLogout}>Logout</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>

                <Portal>
                    <Dialog visible={deleteDialogVisible} onDismiss={hideDeleteDialog}>
                        <Dialog.Title>Delete Account</Dialog.Title>
                        <Dialog.Content><Text variant="bodyMedium">Are you sure you want to delete this account?</Text></Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={hideDeleteDialog}>Cancel</Button>
                            <Button onPress={handleDeleteAccount}>Delete</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>

                {/* Header with Back Button and Title */} 
                <View style={styles.header}>
                    <TouchableOpacity onPress={goBackHandler} style={styles.backButton}>
                        <Icon source="arrow-left" size={24} color="#3c3c3cff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Profile</Text>
                </View>

                <View>
                    <Text style={styles.firstLastName}>{firstName} {lastName}</Text>
                    <Text style={styles.email}>{email}</Text>
                    <Text style={styles.timeJoined}>Joined: {timeCreated.toLocaleDateString()}</Text>
                </View>

                <View style={[styles.buttonContainer, { marginBottom: "5%" }]}>
                    {/* Admin Button */}
                    <TouchableOpacity style={styles.adminButton} onPress={handleAdminView}>
                        <View style ={styles.edgeIcons}>
                            <MaterialIcons name="admin-panel-settings" size={20} color="black"/>
                        </View>
                        <View style={styles.buttonContent}>
                            <Text variant="bodyLarge" style={styles.buttonText}>Admin</Text>
                        </View>
                        <View style ={styles.edgeIcons}>
                            <MaterialIcons name="arrow-forward-ios" size={20} color="black"/>
                        </View>
                    </TouchableOpacity>
                </View>
                
                
                <Text style={styles.personalInfo}>Personal Information</Text>
                
                <View style={styles.buttonContainer}>

                    {/* Edit Profile Button */}
                    <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
                        <View style ={styles.edgeIcons}>
                            <MaterialCommunityIcons name="account" size={20} color="black"/>
                        </View>
                        <View style={styles.buttonContent}>
                            <Text variant="bodyLarge" style={styles.buttonText}>Edit Profile</Text>
                        </View>
                        <View style ={styles.edgeIcons}>
                            <MaterialIcons name="arrow-forward-ios" size={20} color="black"/>
                        </View>
                    </TouchableOpacity>
                    
                    {/* Update Password Button */}
                    <TouchableOpacity style={styles.button} onPress={handleUpdatePassword}>
                        <View style ={styles.edgeIcons}>
                            <MaterialIcons name="lock" size={20} color="black"/>
                        </View>
                        <View style={styles.buttonContent}>
                            <Text variant="bodyLarge" style={styles.buttonText}>Update Password</Text>
                        </View>
                        <View style ={styles.edgeIcons}>
                            <MaterialIcons name="arrow-forward-ios" size={20} color="black"/>
                        </View>
                    </TouchableOpacity>

                    {/* Order History Button */}
                    <TouchableOpacity style={styles.button} onPress={handleOrderHistory}>
                        <View style ={styles.edgeIcons}>
                            <MaterialIcons name="history" size={20} color="black"/>
                        </View>
                        <View style={styles.buttonContent}>
                            <Text variant="bodyLarge" style={styles.buttonText}>Order History</Text>
                        </View>
                        <View style ={styles.edgeIcons}>
                            <MaterialIcons name="arrow-forward-ios" size={20} color="black"/>
                        </View>
                    </TouchableOpacity>

                    {/* Payment Methods Button */}
                    {/* <TouchableOpacity style={styles.button} onPress={handlePaymentMethods}>
                        <View style ={styles.edgeIcons}>
                            <MaterialIcons name="credit-card" size={20} color="black"/>
                        </View>
                        <View style={styles.buttonContent}>
                            <Text variant="bodyLarge" style={styles.buttonText}>Payment Methods</Text>
                        </View>
                        <View style ={styles.edgeIcons}>
                            <MaterialIcons name="arrow-forward-ios" size={20} color="black"/>
                        </View>
                    </TouchableOpacity> */}

                    {/* Delete Account Button */}
                    <TouchableOpacity style={styles.button} onPress={showDeleteDialog}>
                        <View style ={styles.edgeIcons}>
                            <MaterialIcons name="delete" size={20} color="black"/>
                        </View>
                        <View style={styles.buttonContent}>
                            <Text variant="bodyLarge" style={styles.buttonText}>Delete Account</Text>
                        </View>
                        <View style ={styles.edgeIcons}>
                            <MaterialIcons name="arrow-forward-ios" size={20} color="black"/>
                        </View>
                    </TouchableOpacity>

                    {/* Logout Button */}
                    <TouchableOpacity style={styles.button} onPress={showLogoutDialog}>
                        <View style ={styles.edgeIcons}>
                            <MaterialIcons name="logout" size={20} color="black"/>
                        </View>
                        <View style={styles.buttonContent}>
                            <Text variant="bodyLarge" style={styles.buttonText}>Logout</Text>
                        </View>
                        <View style ={styles.edgeIcons}>
                            <MaterialIcons name="arrow-forward-ios" size={20} color="black"/>
                        </View>
                    </TouchableOpacity>

                </View>
            </View>
        </PaperProvider>
    );
}




