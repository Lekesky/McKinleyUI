import createAPIClient from '@/services/api';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Icon, Snackbar, Text, TextInput } from 'react-native-paper';

export default function EditProduct() {
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

    const handleSave = () => {
        if (!image) {
            setSnackbarMessage("Please select an image for menu item.");
            setSnackbarVisible(true);
            return;
        }

        setLoading(true);
        const formData = new FormData();

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

        api.post('menu/add', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((response) => {   
            console.log('Product added successfully:', response.data);
            setSnackbarMessage('Menu item added successfully!');
            setSnackbarVisible(true);
            setTimeout(() => router.back(), 1500); // Navigate back after showing success message
        }).catch(error => {
            console.error('Error adding product:', error);
            setSnackbarMessage('Error adding menu item. Please try again.');
            setSnackbarVisible(true);
        }).finally(() => {
            setLoading(false);
        });
    };

    const handleSaveEdit = () => {
        if (!image && !imageURL) {
            setSnackbarMessage("Please select an image for menu item.");
            setSnackbarVisible(true);
            return;
        }

        setLoading(true);
        const formData = new FormData();

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

        api.put(`menu/update/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((response) => {
            console.log('Product updated successfully:', response.data);
            setSnackbarMessage('Menu item updated successfully!');
            setSnackbarVisible(true);
            setTimeout(() => router.back(), 1500); // Navigate back after showing success message
        }).catch(error => {
            console.error('Error updating product:', error);
            setSnackbarMessage('Error updating menu item. Please try again.');
            setSnackbarVisible(true);
        }).finally(() => {
            setLoading(false);
        });
    };

    const handleDelete = () => {
        setLoading(true);
        
        api.delete(`menu/delete/${id}`)
            .then((response) => {
                console.log('Product deleted successfully:', response.data);
                setSnackbarMessage('Menu item deleted successfully!');
                setSnackbarVisible(true);
                setTimeout(() => router.back(), 1500); // Navigate back after showing success message
            })
            .catch((error) => {
                console.error('Error deleting product:', error);
                setSnackbarMessage('Error deleting menu item. Please try again.');
                setSnackbarVisible(true);
            })
            .finally(() => {
                setLoading(false);
            });
    };

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
            <ScrollView style={styles.container}>
                {/* Header with Back Button */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Icon source="arrow-left" size={24} color="#3c3c3cff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>
                        {parsedProduct.id !== "" ? "Edit Menu Item" : "Add Menu Item"}
                    </Text>
                </View>

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

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#ffffffff'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#ffffffff',
        marginBottom: "1%"
    },
    backButton: { 
        backgroundColor: '#e8e8e8ff', 
        width: 50, 
        height: 50, 
        borderRadius: 25, 
        justifyContent: 'center', 
        alignItems: 'center',
        marginRight: 16
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#871919ff',
        fontFamily: 'Helvetica'
    },
    formContainer: {
        padding: 20,
        paddingTop: 10
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 5,
        color: '#3c3c3cff',
        fontFamily: 'Helvetica'
    },
    input: { 
        marginBottom: 20,
        backgroundColor: '#e8e8e8ff',
        height: 58
    },
    descriptionInput: {
        marginBottom: 20,
        backgroundColor: '#e8e8e8ff',
        textAlignVertical: 'top',
        minHeight: 120
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 15,
        color: '#871919ff',
        fontFamily: 'Helvetica'
    },
    imageSection: {
        marginTop: 15,
        marginBottom: 25,
        backgroundColor: '#ffffffff',
        borderRadius: 20,
        padding: 15
    },
    imagePreviewContainer: {
        alignItems: 'center',
        marginBottom: 20,
        padding: 15,
        borderRadius: 25,
        backgroundColor: '#f9f9f9',
        elevation: 2
    },
    imageLabel: {
        fontSize: 16,
        marginBottom: 10,
        fontWeight: '500',
        fontFamily: 'Helvetica',
        color: '#871919ff'
    },
    imagePreview: {
        width: 250,
        height: 250,
        borderRadius: 25,
        marginBottom: 10
    },
    noImageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 150,
        backgroundColor: '#f9f9f9',
        borderRadius: 25,
        marginBottom: 20,
        elevation: 1
    },
    noImageText: {
        color: '#888888',
        fontSize: 16,
        fontFamily: 'Helvetica'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    imageButton: {
        flex: 1,
        marginHorizontal: 5,
        marginBottom: 15,
        borderRadius: 30,
        height: 58
    },
    actionButtonsContainer: {
        marginTop: 20,
        marginBottom: 40
    },
    deleteButton: { 
        marginTop: 10, 
        marginBottom: 15, 
        backgroundColor: '#DF2935',
        borderRadius: 30,
        height: 58,
        justifyContent: 'center'
    },
    saveButton: { 
        marginTop: 5,
        marginBottom: 10,
        borderRadius: 30,
        height: 58,
        justifyContent: 'center'
    },
    snackbar: {
        bottom: 20,
        backgroundColor: '#3c3c3cff',
        borderRadius: 20
    }
});