import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

import { useAuth } from "@/context/AuthContext";
import createAPIClient from "@/services/api";
import { router } from "expo-router";
import parsePhoneNumberFromString from "libphonenumber-js";
import { useCallback, useEffect, useState, useMemo } from "react";
import { Icon, Text, TextInput } from "react-native-paper";

export default function EditProfile() {
    const { uid, accessToken } = useAuth();
    const api = useMemo(() => createAPIClient(), []);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dialingCode, setDialingCode] = useState('+1');
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

    const fetchUserDetails = useCallback(async() => {
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
            console.error("Error fetching user details:", error);
        });
    }, [api, uid, accessToken]);

    const parsePhoneNumber = (fullNumber: string) => {
        const parsedNumber = parsePhoneNumberFromString(fullNumber);
        if (parsedNumber) {
            return parsedNumber.format('E.164');
        }else{
            console.error("Could not parse phone number");
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
        <View style={styles.container}>

            {/* Header with Back Button and Title */} 
            <View style={styles.header}>
                <TouchableOpacity onPress={goBackHandler} style={styles.backButton}>
                    <Icon source="arrow-left" size={24} color="#3c3c3cff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
            </View>

            <View style={styles.updateProfileForm}>
                {firstNameError && <Text style={styles.errorText}>First Name is required</Text>}
                <TextInput mode="outlined" placeholder="First Name" value={firstName} onChangeText={setFirstName} style={styles.textInput} outlineStyle={styles.textInputOutline} error={firstNameError} outlineColor={firstNameError ? '#871919ff' : 'rgba(135, 25, 25, 0)'} activeOutlineColor="#871919ff"/>
                {lastNameError && <Text style={styles.errorText}>Last Name is required</Text>}
                <TextInput mode="outlined" placeholder="Last Name" value={lastName} onChangeText={setLastName} style={styles.textInput} outlineStyle={styles.textInputOutline} error={lastNameError} outlineColor={lastNameError ? '#871919ff' : 'rgba(135, 25, 25, 0)'} activeOutlineColor="#871919ff"/>
                <TextInput mode="outlined" placeholder="Email" value={email} onChangeText={setEmail} style={styles.textInputDisable} outlineStyle={styles.textInputOutline} editable={false} outlineColor={'rgba(135, 25, 25, 0)'} activeOutlineColor="#871919ff"/>
                {/* Phone Number with Dialing Code */}
                {phoneNumberError && <Text style={styles.errorText}>Phone Number is invalid</Text>}
                <View style={styles.phoneNumberContainer}>
                    <TextInput
                        mode="outlined"
                        placeholder="+1"
                        value={dialingCode}
                        onChangeText={setDialingCode}
                        style={[styles.textInput, styles.dialingCodeInput]}
                        outlineStyle={styles.textInputOutline}
                        outlineColor={'rgba(135, 25, 25, 0)'}
                        activeOutlineColor="#871919ff"
                    />
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
                    />
                </View>
            </View>
            <View>
                <TouchableOpacity onPress={handleEditProfile} style={styles.updatePasswordButton}>
                    <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Update Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        marginTop: 30,
        marginBottom: "30%",
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    headerTitle: {
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
    updateProfileForm: {
        marginTop: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 5,
        marginLeft: 15,
    },
    textInput: { 
        marginBottom: 15, 
        backgroundColor: '#e8e8e8ff', 
        height: 58 
    },
    textInputDisable: {
        marginBottom: 15, 
        backgroundColor: '#c3c2c2ff', 
        height: 58 
    },
    textInputOutline: { 
        borderRadius: 30, 
        // borderWidth: 0 
    },
    phoneNumberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    dialingCodeInput: {
        flex: 1,
        maxWidth: 100,
    },
    phoneNumberInput: {
        flex: 3,
    },
});