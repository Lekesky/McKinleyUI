import { Platform, StyleSheet } from 'react-native';

const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
    paddingHorizontal: isWeb ? 80 : 20,
    paddingVertical: 20,
    alignItems: isWeb ? 'center' : 'stretch',
  },
  // Header styles - updated to match Order.tsx
  header: {
    width: '100%',
    maxWidth: isWeb ? 1800 : undefined,
    marginBottom: "1%",
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    alignSelf: isWeb ? 'center' : 'auto',
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
    width: '100%',
    maxWidth: isWeb ? 1800 : undefined,
    paddingVertical: 10,
    backgroundColor: 'transparent',
    marginBottom: 0,
    paddingHorizontal: 0,
    alignSelf: isWeb ? 'center' : 'auto',
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
  
  // Category styles - consistent with CustomerHome
  pillContainer: { 
    flexDirection: 'row',
    alignSelf: isWeb ? 'center' : 'auto',
    width: '100%',
    maxWidth: isWeb ? 1800 : undefined,
  },
  buttonSegment: { 
    marginHorizontal: 5,
    marginVertical: 20, 
    backgroundColor: '#871919ff',
    minWidth: 105,
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
    width: '100%',
    paddingBottom: 100,
  },
  menuContainer: {
    width: '100%',
    maxWidth: isWeb ? 1800 : undefined,
    paddingHorizontal: isWeb ? 20 : 0,
    marginBottom: 20,
    alignSelf: 'center',
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
    justifyContent: isWeb ? "flex-start" : "space-between",
    alignItems: 'flex-start',
    gap: isWeb ? 25 : 0,
  },
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: isWeb ? 0 : 16,
    width: isWeb ? 280 : "48%",
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