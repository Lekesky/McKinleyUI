import { ScrollView, View } from "react-native";
import { Button } from 'react-native-paper';
import styles from "../styles/components/HorizontalPills.styles";

interface HorizontalPillsProps {
    readonly categories: string[];
    readonly selectedCategory: string;
    readonly setSelectedCategory: (category: string) => void;
}

export default function HorizontalPills({ categories, selectedCategory, setSelectedCategory }: HorizontalPillsProps) {
    return (
        <View style={styles.pillContainer}>
            {categories.map((category) => (
                <Button
                key={category}
                mode="contained" 
                textColor="#fff"
                style={[
                    styles.buttonSegment,
                    selectedCategory === category && styles.selectedButton
                ]}
                onPress={() => setSelectedCategory(category)}
                >
                {category}
                </Button>
            ))}
        </View>
    );
}
