import { useAuth } from '@/context/AuthContext';
import createAPIClient from '@/services/api';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { Image, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { Button, Icon, Snackbar, Text, TextInput } from 'react-native-paper';
import { Toast } from 'toastify-react-native';
import styles from '../styles/EditProducts.styles';

export default function EditProduct() {
    const { uid } = useAuth();
    const router = useRouter();
    const { product } = useLocalSearchParams(); // Retrieve the product details
    const productString = Array.isArray(product) ? product[0] : product;
    const parsedProduct = JSON.parse(productString);
    const [id] = React.useState(parsedProduct.id); // Use the id from parsed product or empty string
    const [name, setName] = React.useState(parsedProduct.name);
    const [description, setDescription] = React.useState(parsedProduct.description);
    const [price, setPrice] = React.useState(parsedProduct.price.toString());
    const [imageURL] = React.useState(parsedProduct.imageURL);
    const [image, setImage] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [snackbarVisible, setSnackbarVisible] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const api = useMemo(() => createAPIClient(), []);

    const handleSave = useCallback(() => {
        if (!image) {
            setSnackbarMessage("Please select an image for menu item.");
            setSnackbarVisible(true);
            return;
        }

        setLoading(true);
        const formData = new FormData();

        const authorId = uid;
        formData.append('authorId', authorId || '');

        const menuItem = {
            name,
            description,
            price: parseFloat(price),
        };
        
        formData.append('menuItem', JSON.stringify(menuItem));

        const filename = image.split('/').pop() || 'photo.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('image', {
            uri: image,
            name: filename,
            type
        } as any);

        api.post('menu', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(() => {
                setSnackbarMessage('Menu item added successfully!');
                setSnackbarVisible(true);
                setTimeout(() => router.back(), 1500);
            })
            .catch((error) => {
                const errorMessage = error.response?.data || error.message || 'Error adding menu item';
                const displayMessage = typeof errorMessage === 'string' ? errorMessage : 'Error adding menu item. Please try again.';
                setSnackbarMessage(displayMessage);
                setSnackbarVisible(true);
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: displayMessage,
                    position: 'top',
                    backgroundColor: '#871919ff',
                    textColor: '#FFFFFF',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    }, [image, uid, name, description, price, api, router]);

    const handleSaveEdit = useCallback(() => {
        if (!image && !imageURL) {
            setSnackbarMessage("Please select an image for menu item.");
            setSnackbarVisible(true);
            return;
        }

        setLoading(true);
        const formData = new FormData();

        const authorId = uid;
        formData.append('authorId', authorId || '');

        const menuItem = {
            id,
            name,
            description,
            price: parseFloat(price),
        };
        formData.append('menuItem', JSON.stringify(menuItem));

        // Only append image if a new one was selected
        if (image) {
            const filename = image.split('/').pop() || 'photo.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image`;

            formData.append('image', {
                uri: image,
                name: filename,
                type
            } as any);
        }

        api.patch(`menu/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(() => {
                setSnackbarMessage('Menu item updated successfully!');
                setSnackbarVisible(true);
                setTimeout(() => router.back(), 1500);
            })
            .catch((error) => {
                const errorMessage = error.response?.data || error.message || 'Error updating menu item';
                const displayMessage = typeof errorMessage === 'string' ? errorMessage : 'Error updating menu item. Please try again.';
                setSnackbarMessage(displayMessage);
                setSnackbarVisible(true);
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: displayMessage,
                    position: 'top',
                    backgroundColor: '#871919ff',
                    textColor: '#FFFFFF',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    }, [image, imageURL, uid, id, name, description, price, api, router]);

    const handleDelete = useCallback(() => {
        setLoading(true);
        
        api.delete(`menu/${id}`)
            .then(() => {
                setSnackbarMessage('Menu item deleted successfully!');
                setSnackbarVisible(true);
                setTimeout(() => router.back(), 1500);
            })
            .catch((error) => {
                const errorMessage = error.response?.data || error.message || 'Error deleting menu item';
                const displayMessage = typeof errorMessage === 'string' ? errorMessage : 'Error deleting menu item. Please try again.';
                setSnackbarMessage(displayMessage);
                setSnackbarVisible(true);
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: displayMessage,
                    position: 'top',
                    backgroundColor: '#871919ff',
                    textColor: '#FFFFFF',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    }, [api, id, router]);

    const handleSelectImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleTakePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <>

            {Platform.OS !== 'web' && (
                <>
                    {/* Header with Back Button */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Icon source="arrow-left" size={24} color="#3c3c3cff" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>
                            {parsedProduct.id !== "" ? "Edit Menu Item" : "Add Menu Item"}
                        </Text>
                    </View>
                </>
            )}

            <ScrollView style={styles.container}>
                <View style={styles.formContainer}>
                    <Text style={styles.inputLabel}>Product Name</Text>
                    <TextInput
                        mode="outlined"
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter product name"
                        outlineStyle={{ borderRadius: 30, borderWidth: 0 }}
                        theme={{ colors: { primary: '#871919ff' } }}
                        disabled={loading}
                        contentStyle={{ fontFamily: 'Helvetica' }}
                    />

                    <Text style={styles.inputLabel}>Description</Text>
                    <TextInput
                        mode="outlined"
                        multiline={true}
                        numberOfLines={4}
                        style={styles.descriptionInput}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Enter product description"
                        outlineStyle={{ borderRadius: 30, borderWidth: 0 }}
                        theme={{ colors: { primary: '#871919ff' } }}
                        disabled={loading}
                        contentStyle={{ fontFamily: 'Helvetica' }}
                    />

                    <Text style={styles.inputLabel}>Price ($)</Text>
                    <TextInput
                        mode="outlined"
                        style={styles.input}
                        value={price}
                        onChangeText={setPrice}
                        placeholder="0.00"
                        keyboardType="numeric"
                        outlineStyle={{ borderRadius: 30, borderWidth: 0 }}
                        theme={{ colors: { primary: '#871919ff' } }}
                        left={<TextInput.Affix text="$" />}
                        disabled={loading}
                        contentStyle={{ fontFamily: 'Helvetica' }}
                    />
                
                    <View style={styles.imageSection}>
                        <Text style={styles.sectionTitle}>Menu Item Image</Text>
                        {image && (
                            <View style={styles.imagePreviewContainer}>
                                <Text style={styles.imageLabel}>Selected Image:</Text>
                                <Image
                                    source={{ uri: image }}
                                    style={styles.imagePreview}
                                />
                            </View>
                        )} 

                        {(imageURL && !image) ? (
                            <View style={styles.imagePreviewContainer}>
                                <Text style={styles.imageLabel}>Current Image:</Text>
                                <Image
                                    source={{ uri: imageURL }}
                                    style={styles.imagePreview}
                                />
                            </View>
                        ) : (
                            !image && 
                            <View style={styles.noImageContainer}>
                                <Text style={styles.noImageText}>No image selected</Text>
                            </View>
                        )}
                        
                        <View style={styles.buttonContainer}>
                            <Button 
                                mode="contained" 
                                icon="image" 
                                onPress={handleSelectImage}
                                style={styles.imageButton}
                                buttonColor="#871919ff"
                                disabled={loading}
                                labelStyle={{ fontFamily: 'Helvetica', fontWeight: 'bold', fontSize: 16 }}
                                contentStyle={{ height: 58 }}
                            >
                                Select Image
                            </Button>
                            
                            <Button 
                                mode="contained" 
                                icon="camera" 
                                onPress={handleTakePhoto}
                                style={styles.imageButton}
                                buttonColor="#871919ff"
                                disabled={loading}
                                labelStyle={{ fontFamily: 'Helvetica', fontWeight: 'bold', fontSize: 16 }}
                                contentStyle={{ height: 58 }}
                            >
                                Take Photo
                            </Button>
                        </View>
                    </View>

                    <View style={styles.actionButtonsContainer}>
                        {parsedProduct.id !== "" && (
                            <Button 
                                style={styles.deleteButton} 
                                mode="contained" 
                                onPress={handleDelete}
                                icon="delete"
                                disabled={loading}
                                labelStyle={{ fontFamily: 'Helvetica', fontWeight: 'bold', fontSize: 16 }}
                                contentStyle={{ height: 58 }}
                            >
                                Delete Item
                            </Button>
                        )}
                        
                        <Button 
                            style={styles.saveButton} 
                            mode="contained" 
                            onPress={parsedProduct.id !== "" ? handleSaveEdit : handleSave}
                            icon="content-save"
                            buttonColor="#871919ff"
                            disabled={loading}
                            loading={loading}
                            labelStyle={{ fontFamily: 'Helvetica', fontWeight: 'bold', fontSize: 16 }}
                            contentStyle={{ height: 58 }}
                        >
                            Save
                        </Button>
                    </View>
                </View>
            </ScrollView>

            {/* Snackbar for showing messages */}
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
                style={styles.snackbar}
                action={{
                    label: 'OK',
                    onPress: () => setSnackbarVisible(false),
                }}
            >
                {snackbarMessage}
            </Snackbar>
        </>
    );
}

