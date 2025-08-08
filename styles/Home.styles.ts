import { StyleSheet } from 'react-native';
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

export default styles;