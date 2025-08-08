import { router } from "expo-router";
import { Button, Image, Text, View } from "react-native";
import styles from "../../styles/Home.styles";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Image testID = "logo-image"
        source={{ uri: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092" }}
        style={styles.heroImage}
        resizeMode="cover"
      />

      <Text style={styles.title}>🍽️ Welcome to McKinley Grill</Text>
      <Text style={styles.subtitle}>Your favorite dishes, delivered fresh.</Text>

      <View style={styles.buttonGroup}>
        <Button title="View Menu" onPress={() => router.push("/(tabs)/Menu")} />
        {/* <Button title="View Orders" onPress={() => router.push("/orders")} /> */}
        {/* Optional: add a logout button */}
        {/* <Button title="Logout" color="red" onPress={handleLogout} /> */}
      </View>
    </View>
  );
}


