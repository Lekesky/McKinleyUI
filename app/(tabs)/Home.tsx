import { View, Text, StyleSheet, Image, Button } from "react-native";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Image
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

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  heroImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonGroup: {
    width: "100%",
    gap: 10,
  },
});
