import { useAuth } from '@/context/AuthContext';
import createAPIClient from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { Icon, TextInput } from 'react-native-paper';
import ToastManager, { Toast } from 'toastify-react-native';
import styles from '../styles/UpdatePassword.styles';

export default function UpdatePassword() {
    const { uid } = useAuth();
    const api = useMemo(() => createAPIClient(), []);
    
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const hasCharMin = newPassword.length >= 8 ? <Ionicons name="checkmark-circle-outline" size={24} color="green" /> : <Ionicons name="close-circle-outline" size={24} color="red"/>;
    const hasUppercase = /[A-Z]/.test(newPassword) ? <Ionicons name="checkmark-circle-outline" size={24} color="green" /> : <Ionicons name="close-circle-outline" size={24} color="red"/>;
    const hasNumber = /[0-9]/.test(newPassword) ? <Ionicons name="checkmark-circle-outline" size={24} color="green" /> : <Ionicons name="close-circle-outline" size={24} color="red"/>;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? <Ionicons name="checkmark-circle-outline" size={24} color="green" /> : <Ionicons name="close-circle-outline" size={24} color="red"/>;
    const [oldPasswordError, setOldPasswordError] = useState(false);
    const passwordMeetsRequirements =
        newPassword.length >= 8 &&
        /[A-Z]/.test(newPassword) &&
        /[0-9]/.test(newPassword) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    const newPasswordError =
        newPassword !== confirmPassword &&
        confirmPassword.length > 0 &&
        passwordMeetsRequirements;

    const confirmPasswordError =
        newPassword !== confirmPassword &&
        confirmPassword.length > 0 &&
        passwordMeetsRequirements;
    const hideRequirements = newPassword.length === 0;

    const CustomToast = ({ text1, text2, hide, iconColor } : any) => (
        <View style={styles.customToast}>
            <Ionicons name="checkmark-circle-outline" size={24} color="white" />
            <View style={styles.textContainer}>
                <Text style={styles.customTitle}>{text1}</Text>
                {text2 && <Text style={styles.customMessage}>{text2}</Text>}
            </View>
            <Ionicons name="close" size={20} color="#fff" onPress={hide} />
        </View>
    );

    const toastConfig = {
        customSuccess: (props: any) => (
            <View style={styles.customSuccessToast}>
            <Ionicons name="checkmark-circle-outline" size={24} color="white" />
            <View style={styles.textContainer}>
                <Text style={styles.customTitle}>{props.text1}</Text>
                {props.text2 && <Text style={styles.customMessage}>{props.text2}</Text>}
            </View>
            </View>
        ),
        custom: (props: any) => <CustomToast {...props} />,
    };

    const goBackHandler = () => { router.back() }

    const handleUpdatePassword = useCallback(() => {
        if(oldPassword.length === 0){
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please enter your current password',
                position: 'top',
                backgroundColor: '#871919ff',
                textColor: '#FFFFFF',
                iconColor: '#FFFFFF',
            });
            setOldPasswordError(true);
            return;
        }
        const updateData = { userId: uid, currentPassword: oldPassword, newPassword };
        api.patch('/user/update-password', updateData)
        .then((response) => {
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Password updated successfully',
                position: 'top',
                backgroundColor: '#4CAF50',
                textColor: '#FFFFFF',
                iconColor: '#FFFFFF',
            });
            router.replace('/(tabs)/Profile');
        })
        .catch((error) => {
            const errorMessage = error.response?.data || error.message || 'Failed to update password';
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: typeof errorMessage === 'string' ? errorMessage : 'Failed to update password',
                position: 'top',
                backgroundColor: '#871919ff',
                visibilityTime: 4000,
                textColor: '#FFFFFF',
                iconColor: '#FFFFFF',
            });
            setOldPasswordError(true);
        });
    }, [oldPassword, newPassword, uid, api]);

    return(
        <View style={styles.container}>
            <ToastManager
                config={toastConfig}
                showProgressBar={false}
                showCloseIcon={true}
                animationStyle="fade"
            />

            {Platform.OS !== 'web' && (
                <>
                    {/* Header with Back Button and Title */} 
                    <View style={styles.header}>
                        <TouchableOpacity onPress={goBackHandler} style={styles.backButton}>
                            <Icon source="arrow-left" size={24} color="#3c3c3cff" />
                        </TouchableOpacity>
                        <Text style={styles.profileTitle}>Update Password</Text>
                    </View>
                </>
            )}

            


            <View style={styles.updatePasswordForm}>
                <TextInput 
                    mode="outlined" 
                    placeholder="Old Password" 
                    secureTextEntry={!showOldPassword} 
                    value={oldPassword} 
                    onChangeText={setOldPassword} 
                    style={styles.textInput} 
                    right={
                        <TextInput.Icon onPress={() => setShowOldPassword(!showOldPassword)} icon={showOldPassword ? "eye" : "eye-off"} />
                    } 
                    outlineStyle={styles.textInputOutline}
                    error={oldPasswordError}
                />
                <View>
                    <TextInput 
                        mode="outlined" 
                        placeholder="New Password" 
                        secureTextEntry={!showNewPassword} 
                        value={newPassword} 
                        onChangeText={setNewPassword} 
                        style={styles.textInput} 
                        right={
                            <TextInput.Icon onPress={() => setShowNewPassword(!showNewPassword)} icon={showNewPassword ? "eye" : "eye-off"} />
                        } 
                        outlineStyle={styles.textInputOutline}
                        error={newPasswordError}
                    />
                    {!hideRequirements && (
                        <View style={styles.requirements}>
                            <View style={styles.requirementRow}>
                                <View style={styles.requirementIcon}>{hasCharMin}</View>
                                <Text style={styles.requirementText}>At least 8 characters</Text>
                            </View>
                            <View style={styles.requirementRow}>
                                <View style={styles.requirementIcon}>{hasUppercase}</View>
                                <Text style={styles.requirementText}>At least 1 uppercase letter</Text>
                            </View>
                            <View style={styles.requirementRow}>
                                <View style={styles.requirementIcon}>{hasNumber}</View>
                                <Text style={styles.requirementText}>At least 1 number</Text>
                            </View>
                            <View style={styles.requirementRow}>
                                <View style={styles.requirementIcon}>{hasSpecialChar}</View>
                                <Text style={styles.requirementText}>At least 1 special character</Text>
                            </View>
                        </View>
                    )}
                    
                </View>
                <TextInput 
                    mode="outlined" 
                    placeholder="Confirm Password" 
                    secureTextEntry={!showConfirmPassword} 
                    value={confirmPassword} 
                    onChangeText={setConfirmPassword} 
                    style={styles.textInput} 
                    right={
                        <TextInput.Icon onPress={() => setShowConfirmPassword(!showConfirmPassword)} icon={showConfirmPassword ? "eye" : "eye-off"} />
                    } 
                    outlineStyle={styles.textInputOutline}
                    error={confirmPasswordError}
                />

                <View>
                    <TouchableOpacity onPress={handleUpdatePassword} style={styles.updatePasswordButton}>
                        <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Update Password</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
        </View>
    );
}

