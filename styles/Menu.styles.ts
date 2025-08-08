import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  desc: {
    fontSize: 14,
    color: "#666",
    marginVertical: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    marginTop: 8,
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 6,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cartBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 46,
    borderTopWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default styles;