import { useAuth } from "@/context/AuthContext";
import { useMobileTabBar } from "@/context/TabBarContext";
import createAPIClient from "@/services/api";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Modal, Platform, TouchableOpacity, View } from "react-native";
import { Button, Dialog, Icon, Portal, Text } from "react-native-paper";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Toast } from 'toastify-react-native';
import styles from "../../styles/Profile.styles";

export default function Profile() {
    const { accessToken, logout, deleteAccount, uid } = useAuth();
    const { hideTabBar, showTabBar } = useMobileTabBar();
    const api = useMemo(() => createAPIClient(), []);
    const insets = useSafeAreaInsets();
    const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [timeCreated, setTimeCreated] = useState(new Date());
    const [signInMethod, setSignInMethod] = useState("");


    useEffect(() => {
        if (!uid) return;
        
        api.get(`/user/${uid}`)
            .then((res) => {
                setFirstName(res.data.firstName)
                setLastName(res.data.lastName)
                setEmail(res.data.email)
                setTimeCreated(new Date(res.data.timeCreated));
                setSignInMethod(res.data.signInMethod);
            })
            .catch((error) => {
                const errorMessage = error.response?.data || error.message || 'Failed to fetch user details';
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: typeof errorMessage === 'string' ? errorMessage : 'Failed to fetch user details',
                    position: 'top',
                    backgroundColor: '#871919ff',
                    textColor: '#FFFFFF',
                });
            });
    },[api, uid, accessToken]);
    
    // Ensure tab bar is shown when component unmounts
    useEffect(() => {
        return () => {
            showTabBar();
        };
    }, [showTabBar]);

    const showLogoutDialog = () => {
        setLogoutModalVisible(!logoutModalVisible);
        setLogoutDialogVisible(true);
        hideTabBar();
    };
    const hideLogoutDialog = () => {
        setLogoutDialogVisible(false);
        showTabBar();
    };
    const showDeleteDialog = () => {
        setDeleteModalVisible(!deleteModalVisible);
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
        // Payment methods logic
    }

    const handleDeleteAccount = async () => {
        //Need to add password confirmation before allowing deletion
        hideDeleteDialog();
        await deleteAccount();
    }


    const handleLogout = async () => {
        hideLogoutDialog();
        await logout();
    }

    return (
        // <PaperProvider>
            <View style={[styles.container, { paddingTop: insets.top }]}>

                {Platform.OS !== 'web' ? ( 
                    <>
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
                    </>
                ) : (
                    <>
                        <Modal
                            transparent={true}
                            visible={logoutModalVisible}
                            onRequestClose={() => {
                                setLogoutModalVisible(!logoutModalVisible);
                        }}>
                            <View style={styles.webModalOverlay}>
                                <View style={styles.centeredModelView}>
                                    <View style={styles.modalView}>
                                    <Text style={styles.modalTextHeader}>Confirm Logout?</Text>
                                    <Text style={styles.modalText}>Are you sure you want to log out?</Text>
                                    <View style={styles.modalButtonContainer}>
                                        {/* Logout and Cancel Buttons */}
                                        <TouchableOpacity
                                            style={[styles.modalButton, styles.modalButtonCancel]}
                                            onPress={() => setLogoutModalVisible(!logoutModalVisible)}>
                                            <Text style={styles.modalTextStyle}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.modalButton, styles.modalButtonLogout]}
                                            onPress={handleLogout}>
                                            <Text style={styles.modalTextStyle}>Logout</Text>
                                        </TouchableOpacity>
                                    </View>
                                    </View>
                                </View>
                            </View>
                        </Modal>

                        <Modal
                            transparent={true}
                            visible={deleteModalVisible}
                            onRequestClose={() => {
                                setDeleteModalVisible(!deleteModalVisible);
                        }}>
                            <View style={styles.webModalOverlay}>
                                <View style={styles.centeredModelView}>
                                    <View style={styles.modalView}>
                                    <Text style={styles.modalTextHeader}>Delete Account?</Text>
                                    <Text style={styles.modalText}>Are you sure you want to delete your account? This process cannot be undone.</Text>
                                    <View style={styles.modalButtonContainer}>
                                        {/* Delete and Cancel Buttons */}
                                        <TouchableOpacity
                                            style={[styles.modalButton, styles.modalButtonCancel]}
                                            onPress={() => setDeleteModalVisible(!deleteModalVisible)}>
                                            <Text style={styles.modalTextStyle}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.modalButton, styles.modalButtonLogout]}
                                            onPress={handleDeleteAccount}>
                                            <Text style={styles.modalTextStyle}>Delete</Text>
                                        </TouchableOpacity>
                                    </View>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </>
                )}

                {Platform.OS !== 'web' && ( 
                    <>
                        {/* Header with Back Button and Title */} 
                        <View style={styles.header}>
                            <TouchableOpacity onPress={goBackHandler} style={styles.backButton}>
                                <Icon source="arrow-left" size={24} color="#3c3c3cff" />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Profile</Text>
                        </View>
                    </>
                )}
                

                <View>
                    <Text style={styles.firstLastName}>{firstName} {lastName}</Text>
                    <Text style={styles.email}>{email}</Text>
                    <Text style={styles.email}>UID: {uid}</Text>
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
                
                
                
                <View style={styles.buttonContainer}>
                    <Text style={styles.personalInfo}>Personal Information</Text>
                
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
                    {signInMethod === "EMAIL" && (
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
                    )}

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
        // </PaperProvider>
    );
}




