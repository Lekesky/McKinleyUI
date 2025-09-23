import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Text } from "react-native-paper";

interface MenuItemCardProps {
    id: string;
    name: string;
    description: string;
    price: string;
    imageURL: string;
    tags: string[];
    onPress: (id: string) => void;
}

export const MenuItemCard = ({ id, name, price, imageURL, description, tags, onPress } : MenuItemCardProps) => {
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
}

const styles = StyleSheet.create({
    cardContainer: {
    width: '47%',
    margin: 5,
  },
  card: {
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  image: {
    height: 120,
    width: '100%',
  },
  contentContainer: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    lineHeight: 16,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#871919ff',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 10,
    color: '#333',
  },
});