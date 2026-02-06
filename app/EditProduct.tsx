import { useAuth } from '@/context/AuthContext';
import createAPIClient, { MenuItem } from '@/services/api';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
    const [tags, setTags] = useState<string[]>(parsedProduct.tags || []);
    const [newTag, setNewTag] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [availableSides, setAvailableSides] = useState<any[]>([]);
    const [selectedSides, setSelectedSides] = useState<MenuItem[]>([]);
    const [sidesLoading, setSidesLoading] = useState(false);
    const [showSidePicker, setShowSidePicker] = useState(false);
    const [sidesDisplayCount, setSidesDisplayCount] = useState(10);
    const [sidesSearchQuery, setSidesSearchQuery] = useState('');
    const SIDES_DISPLAY_INCREMENT = 10;
    const api = useMemo(() => createAPIClient(), []);

    const loadSidesData = useCallback(async () => {
        if (!id) return;
        // Clear selected sides before reload
        setSelectedSides([]);
        
        setSidesLoading(true);
        try {
            // Fetch all available sides with pageNumber=0 and pageSize=200
            const sidesResponse = await api.get('/menu/sides?pageNumber=0&size=200');
            const sidesData = sidesResponse.data;
            
            // Handle both direct array and paginated response
            let sides = [];
            
            if (Array.isArray(sidesData)) {
                sides = sidesData;
            } else if (sidesData.content) {
                sides = sidesData.content;
            }
            
            setAvailableSides(sides);
            setSidesDisplayCount(10); // Reset display count to initial value

            // Fetch current sides for this menu item
            const menuItemResponse = await api.get(`/menu/${id}`);
            const currentSides : string[] = menuItemResponse.data.availableSidesIds || [];
            if(Array.isArray(currentSides)){
                for(const sideId of currentSides){
                    const side : MenuItem = await api.get(`/menu/${sideId}`).then(res => res.data);
                    setSelectedSides(prevSides => [...prevSides, side]);
                }
            }
        } catch (error: any) {
            console.error('Error loading sides:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to load sides',
                position: 'top',
                backgroundColor: '#871919ff',
                textColor: '#FFFFFF',
            });
        } finally {
            setSidesLoading(false);
        }
    }, [api, id]);

    const loadMoreSides = useCallback(() => {
        setSidesDisplayCount(prevCount => prevCount + SIDES_DISPLAY_INCREMENT);
    }, []);

    useEffect(() => {
        if (id) {
            loadSidesData();
        }
    }, [id, loadSidesData]);

    const handleAddSide = useCallback(async (sideId: string) => {
        if (!id) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Cannot add sides to a new item. Save the item first.',
                position: 'top',
                backgroundColor: '#871919ff',
                textColor: '#FFFFFF',
            });
            return;
        }

        setSidesLoading(true);
        try {
            await api.post(`/menu/${id}/sides/${sideId}`);
            
            // Add the side to selectedSides if not already present
            const side = availableSides.find(s => s.id === sideId);
            if (side && !selectedSides.find(s => s.id === sideId)) {
                setSelectedSides([...selectedSides, side]);
            }

            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Side added successfully!',
                position: 'top',
                backgroundColor: '#4CAF50',
                textColor: '#FFFFFF',
            });
        } catch (error: any) {
            const errorMessage = error.response?.data || error.message || 'Error adding side';
            const displayMessage = typeof errorMessage === 'string' ? errorMessage : 'Error adding side. Please try again.';
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: displayMessage,
                position: 'top',
                backgroundColor: '#871919ff',
                textColor: '#FFFFFF',
            });
        } finally {
            setSidesLoading(false);
        }
    }, [api, id, availableSides, selectedSides]);

    const handleRemoveSide = useCallback(async (sideId: string) => {
        if (!id) return;

        setSidesLoading(true);
        try {
            await api.delete(`/menu/${id}/sides/${sideId}`);
            
            // Remove the side from selectedSides
            setSelectedSides(selectedSides.filter(s => s.id !== sideId));

            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Side removed successfully!',
                position: 'top',
                backgroundColor: '#4CAF50',
                textColor: '#FFFFFF',
            });
        } catch (error: any) {
            const errorMessage = error.response?.data || error.message || 'Error removing side';
            const displayMessage = typeof errorMessage === 'string' ? errorMessage : 'Error removing side. Please try again.';
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: displayMessage,
                position: 'top',
                backgroundColor: '#871919ff',
                textColor: '#FFFFFF',
            });
        } finally {
            setSidesLoading(false);
        }
    }, [api, id, selectedSides]);

    const handleSave = useCallback(async () => {
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

        try {
            if (Platform.OS === 'web') {
                const res = await fetch(image);
                const blob = await res.blob();
                const file = new File([blob], filename, { type });
                formData.append('image', file as any);
            } else {
                formData.append('image', {
                    uri: image,
                    name: filename,
                    type,
                } as any);
            }

            await api.post('menu', formData);

            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Menu item added successfully!',
                position: 'top',
                backgroundColor: '#4CAF50',
                textColor: '#FFFFFF',
            });
            setTimeout(() => router.back(), 1500);
        } catch (error: any) {
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
        } finally {
            setLoading(false);
        }
    }, [image, uid, name, description, price, api, router]);

    const handleSaveEdit = useCallback(async () => {
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

        try {
            // Only append image if a new one was selected
            if (image) {
                const filename = image.split('/').pop() || 'photo.jpg';
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image`;

                if (Platform.OS === 'web') {
                    const res = await fetch(image);
                    const blob = await res.blob();
                    const file = new File([blob], filename, { type });
                    formData.append('image', file as any);
                } else {
                    formData.append('image', {
                        uri: image,
                        name: filename,
                        type,
                    } as any);
                }
            }

            await api.patch(`menu/${id}`, formData);

            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Menu item updated successfully!',
                position: 'top',
                backgroundColor: '#4CAF50',
                textColor: '#FFFFFF',
            });
            setTimeout(() => router.back(), 1500);
        } catch (error: any) {
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
        } finally {
            setLoading(false);
        }
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

    const handleAddTag = useCallback(() => {
        const trimmedTag = newTag.trim().toLowerCase();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            setTags([...tags, trimmedTag]);
            setNewTag('');
        } else if (tags.includes(trimmedTag)) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Tag already exists',
                position: 'top',
                backgroundColor: '#871919ff',
                textColor: '#FFFFFF',
            });
        }
    }, [newTag, tags]);

    const handleRemoveTag = useCallback((tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    }, [tags]);

    const handleSaveTags = useCallback(async () => {
        if (!id) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Cannot save tags for a new item. Save the item first.',
                position: 'top',
                backgroundColor: '#871919ff',
                textColor: '#FFFFFF',
            });
            return;
        }

        setLoading(true);
        try {
            // Send all tags in lowercase to the API
            await api.patch(`menu/tags/${id}`, tags.map(t => t.toLowerCase()));

            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Tags updated successfully!',
                position: 'top',
                backgroundColor: '#4CAF50',
                textColor: '#FFFFFF',
            });
        } catch (error: any) {
            const errorMessage = error.response?.data || error.message || 'Error updating tags';
            const displayMessage = typeof errorMessage === 'string' ? errorMessage : 'Error updating tags. Please try again.';
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: displayMessage,
                position: 'top',
                backgroundColor: '#871919ff',
                textColor: '#FFFFFF',
            });
        } finally {
            setLoading(false);
        }
    }, [api, id, tags]);

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

                    {parsedProduct.id !== "" && (
                        <View style={styles.tagsSection}>
                            <Text style={styles.sectionTitle}>Menu Item Tags</Text>
                            
                            {/* Display existing tags */}
                            <View style={styles.tagsContainer}>
                                {tags.length > 0 ? (
                                    tags.map((tag, index) => (
                                        <View key={index} style={styles.tagChip}>
                                            <Text style={styles.tagText}>{tag}</Text>
                                            <TouchableOpacity 
                                                onPress={() => handleRemoveTag(tag)}
                                                disabled={loading}
                                            >
                                                <Icon source="close-circle" size={18} color="#fff" />
                                            </TouchableOpacity>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={styles.noTagsText}>No tags added yet</Text>
                                )}
                            </View>

                            {/* Add new tag input */}
                            <View style={styles.addTagContainer}>
                                <TextInput
                                    mode="outlined"
                                    textColor='#2e2e2eff'
                                    style={styles.tagInput}
                                    value={newTag}
                                    onChangeText={setNewTag}
                                    placeholder="Enter new tag"
                                    outlineStyle={{ borderRadius: 30, borderWidth: 0 }}
                                    theme={{ colors: { primary: '#871919ff' } }}
                                    disabled={loading}
                                    contentStyle={{ fontFamily: 'Helvetica' }}
                                    onSubmitEditing={handleAddTag}
                                />
                                <Button 
                                    mode="contained" 
                                    icon="plus"
                                    onPress={handleAddTag}
                                    style={styles.addTagButton}
                                    buttonColor="#871919ff"
                                    textColor="#fff"
                                    disabled={loading || !newTag.trim()}
                                    labelStyle={{ fontFamily: 'Helvetica', fontWeight: 'bold' }}
                                    contentStyle={{ height: 48 }}
                                >
                                    Add
                                </Button>
                            </View>

                            {/* Save tags button */}
                            <Button 
                                mode="contained" 
                                icon="content-save"
                                onPress={handleSaveTags}
                                style={styles.saveTagsButton}
                                buttonColor="#4CAF50"
                                textColor="#fff"
                                disabled={loading}
                                labelStyle={{ fontFamily: 'Helvetica', fontWeight: 'bold', fontSize: 16 }}
                                contentStyle={{ height: 58 }}
                            >
                                <Text style={styles.buttonText}>Save Tags</Text>
                            </Button>
                        </View>
                    )}

                    {parsedProduct.id !== "" && (
                        <View style={styles.sidesSection}>
                            <Text style={styles.sectionTitle}>Menu Item Sides</Text>
                            
                            {/* Display selected sides */}
                            <View style={styles.sidesContainer}>
                                {selectedSides.length > 0 ? (
                                    selectedSides.map((side: any) => (
                                        <View key={side.id} style={styles.sideChip}>
                                            <View style={styles.sideChipContent}>
                                                <Text style={styles.sideText}>{side.name}</Text>
                                                <Text style={styles.sidePrice}>${side.price?.toFixed(2)}</Text>
                                            </View>
                                            <TouchableOpacity 
                                                onPress={() => handleRemoveSide(side.id)}
                                                disabled={sidesLoading}
                                            >
                                                <Icon source="close-circle" size={18} color="#fff" />
                                            </TouchableOpacity>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={styles.noSidesText}>No sides added yet</Text>
                                )}
                            </View>

                            {/* Add side button */}
                            <Button 
                                mode="contained" 
                                icon={showSidePicker ? "chevron-up" : "plus"}
                                onPress={() => setShowSidePicker(!showSidePicker)}
                                style={styles.addSideButton}
                                buttonColor="#871919ff"
                                textColor="#fff"
                                disabled={sidesLoading}
                                labelStyle={{ fontFamily: 'Helvetica', fontWeight: 'bold' }}
                                contentStyle={{ height: 48 }}
                            >
                                {showSidePicker ? 'Hide Available Sides' : 'Add Side'}
                            </Button>

                            {/* Available sides picker */}
                            {showSidePicker && (
                                <View style={styles.availableSidesContainer}>
                                    <Text style={styles.availableSidesLabel}>Available Sides:</Text>
                                    
                                    {/* Search input */}
                                    <TextInput
                                        mode="outlined"
                                        textColor='#2e2e2eff'
                                        style={styles.sidesSearchInput}
                                        value={sidesSearchQuery}
                                        onChangeText={setSidesSearchQuery}
                                        placeholder="Search sides..."
                                        outlineStyle={{ borderRadius: 20, borderWidth: 0 }}
                                        theme={{ colors: { primary: '#871919ff' } }}
                                        disabled={sidesLoading}
                                        contentStyle={{ fontFamily: 'Helvetica' }}
                                        left={<TextInput.Icon icon="magnify" />}
                                    />
                                    
                                    {sidesLoading ? (
                                        <Text style={styles.loadingText}>Loading sides...</Text>
                                    ) : availableSides.length > 0 ? (
                                        <>
                                            {(() => {
                                                const filteredSides = availableSides
                                                    .filter((side: any) => !selectedSides.find(s => s.id === side.id))
                                                    .filter((side: any) => 
                                                        sidesSearchQuery.trim() === '' || 
                                                        side.name.toLowerCase().includes(sidesSearchQuery.toLowerCase())
                                                    );
                                                
                                                return filteredSides.length > 0 ? (
                                                    <>
                                                        {filteredSides.slice(0, sidesDisplayCount).map((side: any) => (
                                                            <TouchableOpacity
                                                                key={side.id}
                                                                style={styles.availableSideItem}
                                                                onPress={() => {
                                                                    handleAddSide(side.id);
                                                                    setShowSidePicker(false);
                                                                }}
                                                                disabled={sidesLoading}
                                                            >
                                                                <View style={styles.availableSideContent}>
                                                                    <Text style={styles.availableSideName}>{side.name}</Text>
                                                                    <Text style={styles.availableSidePrice}>${side.price?.toFixed(2)}</Text>
                                                                </View>
                                                                <Icon source="plus-circle" size={20} color="#871919ff" />
                                                            </TouchableOpacity>
                                                        ))}
                                                        
                                                        {/* View More button to show more from page 0 */}
                                                        {sidesDisplayCount < filteredSides.length && sidesSearchQuery.trim() === '' && (
                                                            <Button
                                                                mode="contained"
                                                                icon="chevron-down"
                                                                onPress={loadMoreSides}
                                                                disabled={sidesLoading}
                                                                style={styles.viewMoreButton}
                                                                buttonColor="#871919ff"
                                                                textColor="#fff"
                                                                labelStyle={{ fontFamily: 'Helvetica', fontWeight: 'bold' }}
                                                                contentStyle={{ height: 44 }}
                                                            >
                                                                View More
                                                            </Button>
                                                        )}
                                                    </>
                                                ) : (
                                                    <Text style={styles.noAvailableSidesText}>
                                                        No sides match your search
                                                    </Text>
                                                );
                                            })()}
                                        </>
                                    ) : (
                                        <Text style={styles.noAvailableSidesText}>
                                            {selectedSides.length > 0 && availableSides.length > 0 
                                                ? 'All sides already added' 
                                                : 'No sides available'}
                                        </Text>
                                    )}
                                </View>
                            )}
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

