import { useAuth } from '@/context/AuthContext';
import createAPIClient from '@/services/api';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { Image, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { Button, Icon, Text, TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Toast } from 'toastify-react-native';
import styles from '../styles/EditProducts.styles';

export default function EditProduct() {
    const { uid } = useAuth();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { product } = useLocalSearchParams(); // Retrieve the product details
    const productString = Array.isArray(product) ? product[0] : product;
    const parsedProduct = JSON.parse(productString);
    const [id] = useState(parsedProduct.id); // Use the id from parsed product or empty string
    const [name, setName] = useState(parsedProduct.name);
    const [description, setDescription] = useState(parsedProduct.description);
    const [price, setPrice] = useState(parsedProduct.price.toString());
    const [imageURL] = useState(parsedProduct.imageURL);
    const [featured, setFeatured] = useState(parsedProduct.featured || false);
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const api = useMemo(() => createAPIClient(), []);

    const handleSave = useCallback(() => {
        if (!image) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please select an image for menu item.',
                position: 'top',
                backgroundColor: '#871919ff',
                textColor: '#FFFFFF',
            });
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
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Menu item added successfully!',
                    position: 'top',
                    backgroundColor: '#4CAF50',
                    textColor: '#FFFFFF',
                });
                setTimeout(() => router.back(), 1500);
            })
            .catch((error) => {
                const errorMessage = error.response?.data || error.message || 'Error adding menu item';
                const displayMessage = typeof errorMessage === 'string' ? errorMessage : 'Error adding menu item. Please try again.';
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
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please select an image for menu item.',
                position: 'top',
                backgroundColor: '#871919ff',
                textColor: '#FFFFFF',
            });
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
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Menu item updated successfully!',
                    position: 'top',
                    backgroundColor: '#4CAF50',
                    textColor: '#FFFFFF',
                });
                setTimeout(() => router.back(), 1500);
            })
            .catch((error) => {
                const errorMessage = error.response?.data || error.message || 'Error updating menu item';
                const displayMessage = typeof errorMessage === 'string' ? errorMessage : 'Error updating menu item. Please try again.';
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
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Menu item deleted successfully!',
                    position: 'top',
                    backgroundColor: '#4CAF50',
                    textColor: '#FFFFFF',
                });
                setTimeout(() => router.back(), 1500);
            })
            .catch((error) => {
                const errorMessage = error.response?.data || error.message || 'Error deleting menu item';
                const displayMessage = typeof errorMessage === 'string' ? errorMessage : 'Error deleting menu item. Please try again.';
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

    const handleToggleFeatured = useCallback(() => {
        setLoading(true);
        
        api.patch(`menu/featured/${id}`)
            .then(() => {
                setFeatured(!featured);
                const successMessage = `Menu item ${!featured ? 'marked as featured' : 'removed from featured'}!`;
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: successMessage,
                    position: 'top',
                    backgroundColor: '#4CAF50',
                    textColor: '#FFFFFF',
                });
            })
            .catch((error) => {
                const errorMessage = error.response?.data || error.message || 'Error updating featured status';
                const displayMessage = typeof errorMessage === 'string' ? errorMessage : 'Error updating featured status. Please try again.';
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
    }, [api, id, featured]);

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
        <View style={{ flex: 1, paddingTop: insets.top }}>

            {Platform.OS !== 'web' && (
                <>
                    {/* Header with Back Button */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Icon source="arrow-left" size={24} color="#fff" />
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
                        textColor='#2e2e2eff'
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
                        textColor='#2e2e2eff'
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
                        textColor='#2e2e2eff'
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
                                textColor="#fff"
                                disabled={loading}
                                labelStyle={{ fontFamily: 'Helvetica', fontWeight: 'bold', fontSize: 16 }}
                                contentStyle={{ height: 58 }}
                            >
                                <Text style={styles.buttonText}>Select Image</Text>
                            </Button>
                            
                            <Button 
                                mode="contained" 
                                icon="camera" 
                                onPress={handleTakePhoto}
                                style={styles.imageButton}
                                buttonColor="#871919ff"
                                textColor="#fff"
                                disabled={loading}
                                labelStyle={{ fontFamily: 'Helvetica', fontWeight: 'bold', fontSize: 16 }}
                                contentStyle={{ height: 58 }}
                            >
                                <Text style={styles.buttonText}>Take Photo</Text>
                            </Button>
                        </View>
                    </View>

                    {parsedProduct.id !== "" && (
                        <View style={styles.featuredSection}>
                            <Text style={styles.sectionTitle}>Featured Status</Text>
                            <Button 
                                mode="contained" 
                                icon={featured ? "star" : "star-outline"}
                                onPress={handleToggleFeatured}
                                style={styles.featuredButton}
                                buttonColor={featured ? "#FFD700" : "#871919ff"}
                                textColor={featured ? "#000" : "#fff"}
                                disabled={loading}
                                labelStyle={{ fontFamily: 'Helvetica', fontWeight: 'bold', fontSize: 16 }}
                                contentStyle={{ height: 58 }}
                            >
                                <Text style={[styles.buttonText, featured && { color: '#000' }]}>
                                    {featured ? "Remove from Featured" : "Mark as Featured"}
                                </Text>
                            </Button>
                        </View>
                    )}

                    <View style={styles.actionButtonsContainer}>
                        {parsedProduct.id !== "" && (
                            <Button 
                                style={styles.deleteButton} 
                                mode="contained" 
                                onPress={handleDelete}
                                icon="delete"
                                textColor="#fff"
                                disabled={loading}
                                labelStyle={{ fontFamily: 'Helvetica', fontWeight: 'bold', fontSize: 16 }}
                                contentStyle={{ height: 58 }}
                            >
                                <Text style={styles.buttonText}>Delete Item</Text>
                            </Button>
                        )}
                        
                        <Button 
                            style={styles.saveButton} 
                            mode="contained" 
                            onPress={parsedProduct.id !== "" ? handleSaveEdit : handleSave}
                            icon="content-save"
                            buttonColor="#871919ff"
                            textColor="#fff"
                            disabled={loading}
                            loading={loading}
                            labelStyle={{ fontFamily: 'Helvetica', fontWeight: 'bold', fontSize: 16 }}
                            contentStyle={{ height: 58 }}
                        >
                            <Text style={styles.buttonText}>Save</Text>
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

