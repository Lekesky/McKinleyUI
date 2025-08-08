import api from '@/services/api';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, } from 'react-native-paper';

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

    const handleSave = () => {
        const formData = new FormData();

        const menuItem = {
            name,
            description,
            price: parseFloat(price),
        };
        formData.append('menuItem', JSON.stringify(menuItem));

        if (image) {
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
            }).catch(error => {
                console.error('Error adding product:', error);
            });
        }else{
            return alert("Please select an image for menu item.");
        }

        router.back(); // Navigate back to the previous screen
    };

    const handleSaveEdit = () => {
        const formData = new FormData();

        const menuItem = {
            id,
            name,
            description,
            price: parseFloat(price),
        };
        formData.append('menuItem', JSON.stringify(menuItem));

        if (image) {
            const filename = image.split('/').pop() || 'photo.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image`;

            formData.append('image', {
                uri: image,
                name: filename,
                type
            } as any);

            api.put(`menu/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((response) => {
                console.log('Product updated successfully:', response.data);
            }).catch(error => {
                console.error('Error updating product:', error);
            });
        }else{
            return alert("Please select an image for menu item.");
        }

        router.back(); // Navigate back to the previous screen
    };

    const handleDelete = () => {
        // Add logic to save the updated product details
        console.log('Deleted product:', { name, description, price, imageURL });
        router.back(); // Navigate back to the previous screen
    };

    const handleSelectImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleTakePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
            {parsedProduct.id !== "" ? (
                <Text style={styles.title}>Edit Product: {parsedProduct.name}</Text>
                ) : (
                <Text style={styles.title}>Add New Product</Text>
            )}

            <Text>Product Name: </Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Product Name"
            />

            <Text>Description: </Text>
            <TextInput
                multiline = {true}
                style={styles.description}
                value={description}
                onChangeText={setDescription}
                placeholder="Description"
            />

            <Text>Price: </Text>
            <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="Price"
                keyboardType="numeric"
            />
            
            {(image) && (
                <View>
                    <Text>Selected Image: </Text>
                    <Image
                        source={{ uri: image }}
                        style={{ width: 200, height: 200, marginBottom: 20, borderRadius: 10,
                            alignSelf: 'center' 
                         }}
                    />
                </View>
            )} 

            {(imageURL && !image) ? (
                <View>
                    <Text>Current Image: </Text>
                    <Image
                            source={{ uri: imageURL }}
                            style={{ width: 200, height: 200, marginBottom: 20, borderRadius: 10,
                                alignSelf: 'center' 
                            }}
                        />
                </View>
            ) : (
                !image && <Text>No image selected</Text>
            )}
            
            <Button mode="contained" onPress={handleSelectImage}>Select Image from Camera Roll</Button>
            <Button mode="contained" onPress={handleTakePhoto}>Take Photo</Button>

            {parsedProduct.id !== "" && (
                <Button style={styles.deleteButton} mode="contained" onPress={handleDelete}>Delete</Button>
            )}
            
            {parsedProduct.id !== "" ? (
                <Button style={styles.saveButton} mode="contained" onPress={handleSaveEdit}>Save</Button>
                ) : (
                <Button style={styles.saveButton} mode="contained" onPress={handleSave}>Save</Button>
            )}
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 90, paddingHorizontal: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    deleteButton: { marginTop: 10, marginBottom: 10, backgroundColor: '#DF2935' },
    saveButton: { marginTop: 10, marginBottom: 10, backgroundColor: '#3772FF' },
    input: { marginBottom: 15 },
    description: {  marginBottom: 15 }
});