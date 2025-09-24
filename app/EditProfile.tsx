import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import { router } from "expo-router";
import parsePhoneNumberFromString from "libphonenumber-js";
import { useCallback, useEffect, useState } from "react";
import { Icon, Text, TextInput } from "react-native-paper";

export default function EditProfile() {
    const { uid, accessToken } = useAuth();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dialingCode, setDialingCode] = useState('+1');

    const fetchUserDetails = useCallback(async() => {
        api.get(`/user/${uid}`,
            { headers: { Authorization: `Bearer ${accessToken}` } })
        .then((response) => {
            setFirstName(response.data.firstName);
            setLastName(response.data.lastName);
            setEmail(response.data.email);

            const phone = parsePhoneNumberFromString(response.data.phoneNumber);
            setDialingCode(phone?.countryCallingCode || '+1');
            setPhoneNumber(phone?.formatNational() || '');
        })
        .catch((error) => {
            console.error("Error fetching user details:", error);
        });
    }, [uid, accessToken]);

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
        const parsedPhone = parsePhoneNumber("+" +dialingCode + phoneNumber);
        console.log("Parsed Phone Number:", parsedPhone);
        if(parsedPhone) {
            const updatedData = {
                firstName,
                lastName,
                email,
                phoneNumber: parsedPhone,
            }
            api.patch(`/user/${uid}`, updatedData,
                { headers: { Authorization: `Bearer ${accessToken}` } })
            .then((response) => {
                Alert.alert("Profile updated successfully");
                router.replace('/(tabs)/Profile');
            })
            .catch((error) => {
                console.error("Error updating profile:", error);
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
                <TextInput mode="outlined" placeholder="First Name" value={firstName} onChangeText={setFirstName} style={styles.textInput} outlineStyle={styles.textInputOutline}/>
                <TextInput mode="outlined" placeholder="Last Name" value={lastName} onChangeText={setLastName} style={styles.textInput} outlineStyle={styles.textInputOutline}/>
                <TextInput mode="outlined" placeholder="Email" value={email} onChangeText={setEmail} style={styles.textInput} outlineStyle={styles.textInputOutline}/>
                {/* Phone Number with Dialing Code */}
                <View style={styles.phoneNumberContainer}>
                    <TextInput
                        mode="outlined"
                        placeholder="+1"
                        value={dialingCode}
                        onChangeText={setDialingCode}
                        style={[styles.textInput, styles.dialingCodeInput]}
                        outlineStyle={styles.textInputOutline}
                    />
                    <TextInput
                        mode="outlined"
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        style={[styles.textInput, styles.phoneNumberInput]}
                        outlineStyle={styles.textInputOutline}
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
    textInput: { 
        marginBottom: 15, 
        backgroundColor: '#e8e8e8ff', 
        height: 58 
    },
    textInputOutline: { 
        borderRadius: 30, 
        borderWidth: 0 
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