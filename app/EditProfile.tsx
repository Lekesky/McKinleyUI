import { Alert, Platform, ScrollView, TouchableOpacity, View } from "react-native";

import { useAuth } from "@/context/AuthContext";
import createAPIClient from "@/services/api";
import { router } from "expo-router";
import parsePhoneNumberFromString from "libphonenumber-js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Icon, Menu, Text, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Toast } from 'toastify-react-native';
import styles from "../styles/EditProfile.styles";

// Common country dialing codes
const DIALING_CODES = [
    { code: '+1', country: 'US/Canada' },
    { code: '+44', country: 'UK' },
    { code: '+91', country: 'India' },
    { code: '+86', country: 'China' },
    { code: '+81', country: 'Japan' },
    { code: '+49', country: 'Germany' },
    { code: '+33', country: 'France' },
    { code: '+39', country: 'Italy' },
    { code: '+34', country: 'Spain' },
    { code: '+61', country: 'Australia' },
    { code: '+55', country: 'Brazil' },
    { code: '+52', country: 'Mexico' },
    { code: '+7', country: 'Russia' },
    { code: '+82', country: 'South Korea' },
    { code: '+31', country: 'Netherlands' },
    { code: '+46', country: 'Sweden' },
    { code: '+47', country: 'Norway' },
    { code: '+41', country: 'Switzerland' },
    { code: '+65', country: 'Singapore' },
    { code: '+64', country: 'New Zealand' },
];

export default function EditProfile() {
    const { uid } = useAuth();
    const api = useMemo(() => createAPIClient(), []);
    const insets = useSafeAreaInsets();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dialingCode, setDialingCode] = useState('+1');
    const [menuVisible, setMenuVisible] = useState(false);
    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [phoneNumberError, setPhoneNumberError] = useState(false);
    

    const validateForm = () => {
        let valid = true;
        if (firstName.trim() === '' || null) {
            setFirstNameError(true);    
            valid = false;
        }
        if (lastName.trim() === '' || null) {
            setLastNameError(true);
            valid = false;
        }

        const parsedPhone = parsePhoneNumber("+" + dialingCode + phoneNumber);
        if (!parsedPhone) {
            setPhoneNumberError(true);
            valid = false;
        }
        return valid;
    }

    const fetchUserDetails = useCallback(() => {
        api.get(`/user/${uid}`)
        .then((response) => {
            setFirstName(response.data.firstName);
            setLastName(response.data.lastName);
            setEmail(response.data.email);

            if(response.data.phoneNumber === null){
                setPhoneNumber('');
                return;
            }

            const phone = parsePhoneNumberFromString(response.data.phoneNumber);
            setDialingCode(phone?.countryCallingCode || '+1');
            setPhoneNumber(phone?.formatNational() || '');
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
    }, [api, uid]);

    const parsePhoneNumber = (fullNumber: string) => {
        const parsedNumber = parsePhoneNumberFromString(fullNumber);
        if (parsedNumber) {
            return parsedNumber.format('E.164');
        }else{
            return false;
        }
    }

    const goBackHandler = () => { router.back() }

    const handleEditProfile = () => {
        validateForm();
        if(!validateForm()) {
            Alert.alert("Please fix the errors in the form");
            return;
        }
        const parsedPhone = parsePhoneNumber(dialingCode + phoneNumber);
        if(parsedPhone) {
            const updatedData = {
                firstName,
                lastName,
                email,
                phoneNumber: parsedPhone,
            }
            api.patch(`/user/${uid}`, updatedData)
            .then((response) => {
                Alert.alert("Profile updated successfully");
                router.replace('/(tabs)/Profile');
            })
            .catch((error) => {
                console.error("Error updating profile:", error.response.data);

            });
        }else{
            Alert.alert("Invalid phone number");
            return;
        }
    }

    useEffect(() => {
        fetchUserDetails();
    }, [fetchUserDetails])


    return(
        <View style={[styles.container, { paddingTop: insets.top }]}>

            {Platform.OS !== 'web' && (
                <>
                    {/* Header with Back Button and Title */} 
                    <View style={styles.header}>
                        <TouchableOpacity onPress={goBackHandler} style={styles.backButton}>
                            <Icon source="arrow-left" size={24} color="#3c3c3cff" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Edit Profile</Text>
                    </View>
                </>
            )}

            <View style={styles.updateProfileForm}>
                {/* Avatar Section */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarContainer}>
                        <Icon source="account" size={60} color="#871919ff" />
                    </View>
                    <Text style={styles.avatarLabel}>Profile Information</Text>
                </View>

                {/* Form Card */}
                <View style={styles.formCard}>
                    {/* Personal Information Section */}
                    <Text style={styles.sectionTitle}>Personal Information</Text>
                    
                    {firstNameError && <Text style={styles.errorText}>First Name is required</Text>}
                    <TextInput 
                        mode="outlined" 
                        placeholder="First Name" 
                        value={firstName} 
                        onChangeText={setFirstName} 
                        style={styles.textInput} 
                        outlineStyle={styles.textInputOutline} 
                        error={firstNameError} 
                        outlineColor={firstNameError ? '#871919ff' : 'rgba(135, 25, 25, 0)'} 
                        activeOutlineColor="#871919ff" 
                        textColor='#333'
                        left={<TextInput.Icon icon="account" color="#871919ff" />}
                    />
                    
                    {lastNameError && <Text style={styles.errorText}>Last Name is required</Text>}
                    <TextInput 
                        mode="outlined" 
                        placeholder="Last Name" 
                        value={lastName} 
                        onChangeText={setLastName} 
                        style={styles.textInput} 
                        outlineStyle={styles.textInputOutline} 
                        error={lastNameError} 
                        outlineColor={lastNameError ? '#871919ff' : 'rgba(135, 25, 25, 0)'} 
                        activeOutlineColor="#871919ff" 
                        textColor='#333'
                        left={<TextInput.Icon icon="account-outline" color="#871919ff" />}
                    />
                    
                    {/* Contact Information Section */}
                    <Text style={styles.sectionTitle}>Contact Information</Text>
                    
                    <TextInput 
                        mode="outlined" 
                        placeholder="Email" 
                        value={email} 
                        onChangeText={setEmail} 
                        style={styles.textInputDisable} 
                        outlineStyle={styles.textInputOutline} 
                        editable={false} 
                        outlineColor={'rgba(135, 25, 25, 0)'} 
                        activeOutlineColor="#871919ff" 
                        textColor="#333"
                        left={<TextInput.Icon icon="email" color="#999" />}
                    />
                    {/* Phone Number with Dialing Code */}
                    {phoneNumberError && <Text style={styles.errorText}>Phone Number is invalid</Text>}
                    <View style={styles.phoneNumberContainer}>
                        <Menu
                            visible={menuVisible}
                            onDismiss={() => setMenuVisible(false)}
                            anchor={
                                <TouchableOpacity 
                                    onPress={() => setMenuVisible(true)}
                                    style={styles.dialingCodeButton}
                                >
                                    <Icon source="phone" size={20} color="#871919ff" />
                                    <Text style={styles.dialingCodeText}>{dialingCode}</Text>
                                    <Icon source="chevron-down" size={20} color="#871919ff" />
                                </TouchableOpacity>
                            }
                            contentStyle={styles.menuContent}
                        >
                            <ScrollView style={styles.menuScrollView}>
                                {DIALING_CODES.map((item) => (
                                    <Menu.Item
                                        key={item.code}
                                        onPress={() => {
                                            setDialingCode(item.code);
                                            setMenuVisible(false);
                                        }}
                                        title={`${item.code} (${item.country})`}
                                        titleStyle={dialingCode === item.code ? styles.selectedMenuItem : styles.menuItemText}
                                    />
                                ))}
                            </ScrollView>
                        </Menu>
                        <TextInput
                            mode="outlined"
                            placeholder="Phone Number"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            style={[styles.textInput, styles.phoneNumberInput]}
                            outlineStyle={styles.textInputOutline}
                            error={phoneNumberError}
                            keyboardType="phone-pad"
                            outlineColor={phoneNumberError ? 'red' : 'rgba(135, 25, 25, 0)'}
                            activeOutlineColor="#871919ff"
                            textColor="#333"
                        />
                    </View>
                </View>
                
                {/* Update Button */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={handleEditProfile} style={styles.updatePasswordButton}>
                        <Icon source="check-circle" size={20} color="#ffffff" />
                        <Text style={styles.buttonText}>Update Profile</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
        </View>
    );
}

