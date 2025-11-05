import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
    padding: 20, // Match Order screen
  },
  // Header styles - updated to match Order.tsx
  header: {
    marginTop: 30,
    marginBottom: "1%",
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  backButton: { 
    backgroundColor: '#e8e8e8ff', 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  headerInfo: {
    marginLeft: 0,
  },
  headerTitle: {
    fontSize: 24,
    color: '#871919ff',
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
  },
  orderStatusText: {
    fontSize: 14,
    color: '#666',
  },
  
  // Search styles
  searchContainer: {
    paddingVertical: 10,
    backgroundColor: 'transparent',
    marginBottom: 0,
    paddingHorizontal: 0, // No extra padding needed since container has padding
  },
  searchBarWrapper: {
    height: 50,
    backgroundColor: '#e8e8e8ff',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%',
    paddingVertical: 0,
  },
  searchIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Category styles
  pillContainer: { 
    flexDirection: 'row',
    marginHorizontal: -20, // Extend beyond container padding for edge-to-edge appearance
  },
  buttonSegment: { 
    marginHorizontal: 5,
    marginVertical: 20, 
    backgroundColor: '#871919ff',
    minWidth: 105, // Ensure buttons have reasonable minimum width
  },
  selectedButton: {
    backgroundColor: '#600e0eff',
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  selectedButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  
  // Menu grid styles
  menuGrid: {
    paddingBottom: 100, // Increased to avoid navigation bar overlap
  },
  menuContainer: {
    paddingHorizontal: 0, // No need for extra padding since container has it
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  menuItemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    width: "48%",
    overflow: "hidden",
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  menuImage: {
    width: "100%",
    height: 120,
    backgroundColor: "#eee",
  },
  menuCardContent: {
    padding: 12,
  },
  menuItemName: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 4,
  },
  menuItemDesc: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
    height: 32,
  },
  menuItemPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#871919ff",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#871919ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    marginRight: 4,
  },
  
  // Empty state styles
  emptyState: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#7e7d7dff',
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
  },
  
  // Footer styles - increased padding for navigation bar
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingVertical: 15,
    paddingHorizontal: 16,
    paddingBottom: 25, // Extra padding for navigation bar
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: -1 },
  },
  footerButton: {
    backgroundColor: "#871919ff",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
  },
  footerButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  
  // Loading state
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
});

export default styles;