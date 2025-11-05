import { ScrollView, View } from "react-native";
import { Button } from 'react-native-paper';
import styles from "../styles/Components/HorizontalPills.styles";

interface HorizontalPillsProps {
    readonly categories: string[];
    readonly selectedCategory: string;
    readonly setSelectedCategory: (category: string) => void;
}

export default function HorizontalPills({ categories, selectedCategory, setSelectedCategory }: HorizontalPillsProps) {
    return (
        <View style={styles.pillContainer}>
            <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{paddingLeft: 35, paddingRight: 15}}
            >
            {categories.map((category) => (
                <Button
                key={category}
                mode="contained" 
                style={[
                    styles.buttonSegment,
                    selectedCategory === category && styles.selectedButton
                ]}
                onPress={() => setSelectedCategory(category)}
                >
                {category}
                </Button>
            ))}
            </ScrollView>
        </View>
    );
}
