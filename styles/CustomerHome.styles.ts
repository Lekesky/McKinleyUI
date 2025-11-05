import { Dimensions, StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffffff' },
  disabledInput: {
    // This ensures the input is visually disabled
    color: 'transparent',
  },
  greetingContainer: {
    flex: 1,
    justifyContent: 'center', // Center text vertically in container
    marginRight: 10,
  },
  header: { 
    marginHorizontal: 20, 
    marginTop: "1%",
    height: 80,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
  },
  searchButton: {
    backgroundColor: '#e8e8e8ff', 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  greetingText: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#871919ff', 
    fontFamily: 'Helvetica',
  },
  buttonSegment: { 
    marginHorizontal: 5,
    marginVertical: 20, 
    backgroundColor: '#871919ff' 
  },
  pillContainer: { flexDirection: 'row'},
  selectedButton: {
    backgroundColor: '#600e0eff',
    elevation: 4,
  },
  menuContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  menuItemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  searchContainer: {
    marginLeft: -11,
    height: 50,
    backgroundColor: '#e8e8e8ff',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  searchIcon: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0, 
    position: 'relative',
  },
  inputContainer: {
    flex: 1,
    paddingRight: 10,
    height: '100%',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
    textAlignVertical: 'center',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  waitressContainerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height - 190,
    paddingVertical: 20,
  },
  waitressContainer: {
    width: '90%',
    paddingVertical: 30,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  waitressTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#871919ff',
    marginBottom: 30,
    fontFamily: 'Helvetica',
  },
  tableLayout: {
    width: '100%',
    marginVertical: 20,
    alignItems: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  tableButton: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedTableButton: {
    backgroundColor: '#871919ff',
    borderColor: '#700000',
  },
  tableButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedTableText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  selectedTableInfo: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  takeOrderButton: {
    backgroundColor: '#871919ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    width: 220,
    borderRadius: 30,
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonIcon: {
    marginRight: 10,
  },
  takeOrderButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default styles;