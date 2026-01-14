import { Dimensions, Platform, StyleSheet } from 'react-native';
const isWeb = Platform.OS === 'web';

export const getStyles = (windowWidth: number) => {
  const isMobile = windowWidth <= 768;
  const isSmallMobile = windowWidth <= 480;
  
  return StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#ffffffff', 
    paddingHorizontal: (isWeb && isMobile) ? 16 : (isWeb ? 80 : 40), 
    alignItems: isWeb ? 'center' : 'stretch',
  },
  disabledInput: {
    // This ensures the input is visually disabled
    color: 'transparent',
  },
  greetingContainer: {
    flex: 1,
    justifyContent: 'center', // Center text vertically in container
    alignItems: 'flex-start', // Align text to the left
    marginRight: 10,
  },
  header: { 
    width: '100%',
    maxWidth: isWeb ? 1800 : 1200,
    marginHorizontal: 0, 
    marginTop: (isWeb && isMobile) ? 10 : 20,
    height: (isWeb && isMobile) ? 80 : 100,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: (isWeb && isMobile) ? 10 : 20,
    alignSelf: isWeb ? 'center' : 'auto',
  },
  searchButton: {
    backgroundColor: '#e8e8e8ff', 
    width: (isWeb && isMobile) ? 40 : 50, 
    height: (isWeb && isMobile) ? 40 : 50, 
    borderRadius: (isWeb && isMobile) ? 20 : 25, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  greetingText: { 
    fontSize: (isWeb && isSmallMobile) ? 20 : (isWeb && isMobile) ? 24 : 32, 
    fontWeight: '700', 
    color: '#871919ff', 
    fontFamily: 'Helvetica',
  },
  buttonSegment: { 
    marginHorizontal: 5,
    backgroundColor: '#871919ff',
  },
  pillsWrapper: {
    marginTop: 10,
    marginBottom: 10,
  },
  pillContainer: { 
    flexDirection: 'row',
    alignSelf: isWeb ? 'center' : 'auto',
    flexWrap: (isWeb && isMobile) ? 'wrap' : undefined,
    justifyContent: (isWeb && isMobile) ? 'center' : undefined,
  },
  selectedButton: {
    backgroundColor: '#600e0eff',
    elevation: 4,
  },
  menuContainer: {
    paddingHorizontal: (isWeb && isMobile) ? 10 : 20,
    marginBottom: (isWeb && isMobile) ? 20 : 40,
    width: '100%',
    maxWidth: isWeb ? 1800 : "auto",
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: (isWeb && isMobile) ? 20 : 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  menuItemsGrid: {
    flexDirection: (isWeb && isMobile) ? 'column' : 'row',
    flexWrap: 'wrap',
    // Better utilize horizontal space on web
    justifyContent: isWeb ? 'flex-start' : 'center',
    alignItems: (isWeb && isMobile) ? 'stretch' : 'flex-start',
    gap: (isWeb && isMobile) ? 15 : (isWeb ? 25 : 0),
  },
  searchContainer: {
    height: (isWeb && isMobile) ? 48 : 56,
    backgroundColor: '#f4f4f4',
    borderRadius: (isWeb && isMobile) ? 10 : 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: (isWeb && isMobile) ? 15 : 20,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  searchIcon: {
    width: (isWeb && isMobile) ? 40 : 50,
    height: (isWeb && isMobile) ? 40 : 50,
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
    fontSize: (isWeb && isMobile) ? 14 : 16,
    color: '#333',
    paddingVertical: 0,
    textAlignVertical: 'center',
  },
  emptyState: {
    padding: (isWeb && isMobile) ? 20 : 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: (isWeb && isMobile) ? 14 : 16,
    color: '#666',
    textAlign: 'center',
  },
  waitressContainerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height - 190,
    paddingVertical: (isWeb && isMobile) ? 10 : 20,
  },
  waitressContainer: {
    width: (isWeb && isMobile) ? '95%' : '90%',
    paddingVertical: (isWeb && isMobile) ? 20 : 30,
    paddingHorizontal: (isWeb && isMobile) ? 10 : 15,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  waitressTitle: {
    fontSize: (isWeb && isMobile) ? 22 : 28,
    fontWeight: 'bold',
    color: '#871919ff',
    marginBottom: (isWeb && isMobile) ? 20 : 30,
    fontFamily: 'Helvetica',
  },
  tableLayout: {
    width: '100%',
    marginVertical: (isWeb && isMobile) ? 10 : 20,
    alignItems: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: (isWeb && isMobile) ? 10 : 15,
  },
  tableButton: {
    width: (isWeb && isSmallMobile) ? 50 : (isWeb && isMobile) ? 60 : 70,
    height: (isWeb && isSmallMobile) ? 50 : (isWeb && isMobile) ? 60 : 70,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: (isWeb && isSmallMobile) ? 4 : (isWeb && isMobile) ? 6 : 10,
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
    fontSize: (isWeb && isSmallMobile) ? 18 : (isWeb && isMobile) ? 20 : 24,
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
    height: (isWeb && isMobile) ? 50 : 60,
    width: (isWeb && isMobile) ? 180 : 220,
    borderRadius: 30,
    marginTop: (isWeb && isMobile) ? 15 : 20,
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
    fontSize: (isWeb && isMobile) ? 16 : 18,
  },
});
};

export default getStyles;