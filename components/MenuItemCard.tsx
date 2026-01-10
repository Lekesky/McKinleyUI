import React, { memo } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { Card, Text } from "react-native-paper";
import styles from "../styles/components/MenuItemCard.styles";

interface MenuItemCardProps {
    id: string;
    name: string;
    description: string;
    price: string;
    imageURL: string;
    tags: string[];
    onPress: (id: string) => void;
}

export const MenuItemCard = memo(({ id, name, price, imageURL, description, tags, onPress } : MenuItemCardProps) => {
    return (
        <TouchableOpacity onPress={() => onPress(id)} style={styles.cardContainer}>
            <Card style={styles.card}>
                <Image source={{ uri: imageURL }} style={styles.image} />
                <View style={styles.contentContainer}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.description}>{description}</Text>
                    <Text style={styles.price}>${price}</Text>
                    <View style={styles.tagsContainer}>
                        {tags.map((tag, index) => (
                            <View key={index} style={styles.tag}>
                                <Text style={styles.tagText}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );
});

MenuItemCard.displayName = 'MenuItemCard';