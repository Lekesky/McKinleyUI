import { useAuth } from "@/context/AuthContext";
import createAPIClient from "@/services/api";
import { router } from "expo-router";
import parsePhoneNumberFromString from "libphonenumber-js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Platform, ScrollView, TouchableOpacity, View } from "react-native";
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

export default function CompleteProfile() {
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
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        let valid = true;
        
        setFirstNameError(false);
        setLastNameError(false);
        setPhoneNumberError(false);

        if (!firstName || firstName.trim() === '') {
            setFirstNameError(true);    
            valid = false;
        }
        if (!lastName || lastName.trim() === '') {
            setLastNameError(true);
            valid = false;
        }

        // Ensure phone number has digits
        const cleanPhone = phoneNumber.replace(/\D/g, '');
        if (!cleanPhone || cleanPhone.length < 7) {
            setPhoneNumberError(true);
            valid = false;
            return valid;
        }

        const fullPhone = dialingCode + cleanPhone;
        try {
            const parsedPhone = parsePhoneNumberFromString(fullPhone);
            if (!parsedPhone || !parsedPhone.isValid()) {
                setPhoneNumberError(true);
                valid = false;
            }
        } catch (error) {
            setPhoneNumberError(true);
            valid = false;
        }
        return valid;
    };

    const fetchUserDetails = useCallback(() => {
        api.get(`/user/${uid}`)
        .then((response) => {
            // Set email (guaranteed to be provided)
            setEmail(response.data.email || '');

            // Pre-fill if data exists
            if (response.data.firstName) setFirstName(response.data.firstName);
            if (response.data.lastName) setLastName(response.data.lastName);

            if (response.data.phoneNumber) {
                const phone = parsePhoneNumberFromString(response.data.phoneNumber);
                if (phone) {
                    setDialingCode('+' + phone.countryCallingCode);
                    setPhoneNumber(phone.nationalNumber);
                }
            }
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
        if (parsedNumber && parsedNumber.isValid()) {
            return parsedNumber.format('E.164');
        }
        return null;
    };

    const handleCompleteProfile = () => {
        if (!validateForm()) {
            Alert.alert("Validation Error", "Please fix the errors in the form");
            return;
        }

        setIsSubmitting(true);
        const fullPhone = dialingCode + phoneNumber.replace(/\D/g, '');
        const parsedPhone = parsePhoneNumber(fullPhone);
        
        if (!parsedPhone) {
            Alert.alert("Invalid Phone", "Please enter a valid phone number");
            setIsSubmitting(false);
            return;
        }

        const updatedData = {
            email: email,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phoneNumber: parsedPhone,
        };

        api.patch(`/user/${uid}`, updatedData)
            .then(() => {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Profile completed successfully!',
                    position: 'top',
                    backgroundColor: '#4CAF50',
                    textColor: '#FFFFFF',
                });
                // Navigate to home page
                router.replace('/(tabs)/Home');
            })
            .catch((error) => {
                console.error("Error completing profile:", error);
                const errorMessage = error.response?.data || error.message || 'Failed to update profile';
                Toast.show({
                    type: 'error',
                    text1: 'Update Failed',
                    text2: typeof errorMessage === 'string' ? errorMessage : 'Failed to update profile',
                    position: 'top',
                    backgroundColor: '#871919ff',
                    textColor: '#FFFFFF',
                });
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    useEffect(() => {
        fetchUserDetails();
    }, [fetchUserDetails]);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.updateProfileForm}>
                {/* Avatar Section */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarContainer}>
                        <Icon source="account-plus" size={60} color="#871919ff" />
                    </View>
                    <Text style={styles.avatarLabel}>Complete Your Profile</Text>
                    <Text style={[styles.sectionTitle, { textAlign: 'center', marginTop: 8, color: '#666' }]}>
                        Please provide the required information
                    </Text>
                </View>

                {/* Form Card */}
                <View style={styles.formCard}>
                    {/* Personal Information Section */}
                    <Text style={styles.sectionTitle}>Personal Information</Text>
                    
                    {firstNameError && <Text style={styles.errorText}>First Name is required</Text>}
                    <TextInput 
                        mode="outlined" 
                        placeholder="First Name *" 
                        value={firstName} 
                        onChangeText={(text) => {
                            setFirstName(text);
                            setFirstNameError(false);
                        }}
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
                        placeholder="Last Name *" 
                        value={lastName} 
                        onChangeText={(text) => {
                            setLastName(text);
                            setLastNameError(false);
                        }}
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
                        style={styles.textInputDisable} 
                        outlineStyle={styles.textInputOutline} 
                        editable={false} 
                        outlineColor={'rgba(135, 25, 25, 0)'} 
                        activeOutlineColor="#871919ff" 
                        textColor="#333"
                        left={<TextInput.Icon icon="email" color="#999" />}
                    />

                    {/* Phone Number with Dialing Code */}
                    {phoneNumberError && <Text style={styles.errorText}>Valid phone number is required</Text>}
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
                            placeholder="Phone Number *"
                            value={phoneNumber}
                            onChangeText={(text) => {
                                setPhoneNumber(text);
                                setPhoneNumberError(false);
                            }}
                            style={[styles.textInput, styles.phoneNumberInput]}
                            outlineStyle={styles.textInputOutline}
                            error={phoneNumberError}
                            keyboardType="phone-pad"
                            outlineColor={phoneNumberError ? '#871919ff' : 'rgba(135, 25, 25, 0)'}
                            activeOutlineColor="#871919ff"
                            textColor="#333"
                        />
                    </View>
                </View>
                
                {/* Complete Profile Button */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        onPress={handleCompleteProfile} 
                        style={[styles.updatePasswordButton, isSubmitting && { opacity: 0.6 }]}
                        disabled={isSubmitting}
                    >
                        <Icon source="check-circle" size={20} color="#ffffff" />
                        <Text style={styles.buttonText}>
                            {isSubmitting ? 'Completing...' : 'Complete Profile'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
