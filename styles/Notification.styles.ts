import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  loadingMore: {
    padding: 20,
    alignItems: 'center',
  },
  loadingMoreText: {
    color: '#666',
    fontSize: 14,
    marginTop: 5,
  },
  container: { 
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffffff'
  },
  header: {
    marginTop: 30,
    marginBottom: "5%",
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  // Overlay for darkening the background when sheet is open
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  // Bottom Sheet Styles
  bottomSheet: {
    zIndex: 2,
  },
  bottomSheetContent: {
    flex: 1,
    padding: 20,
    paddingBottom: "25%",
  },
  bottomSheetTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#871919ff',
    marginBottom: 30,
    textAlign: 'center',
    fontFamily: 'Helvetica',
  },
  formGroup: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#e8e8e8ff',
    borderRadius: 30,
    padding: 15,
    fontSize: 16,
    height: 58,
    marginBottom: 15,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  buttonContainer: {
    flexDirection: 'column',
    marginTop: 20,
    gap: 15,
  },
  submitButton: {
    backgroundColor: '#871919ff',
    height: 58, 
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#e8e8e8ff',
    height: 58, 
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    color: '#871919ff',
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
  },
  backButton: { 
    backgroundColor: '#e8e8e8ff', 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  sendButton: {
    backgroundColor: '#871919ff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'center',
    gap: 8,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    minWidth: 70,
    alignItems: 'center',
  },
  activeFilterTab: {
    backgroundColor: '#871919ff',
  },
  filterTabText: {
    color: '#333',
    fontWeight: '500',
  },
  activeFilterTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    position: 'relative',
  },
  unreadCard: {
    backgroundColor: '#fff9f9',
    borderLeftWidth: 3,
    borderLeftColor: '#871919ff',
  },
  unreadIndicator: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 8,
    height: 8,
    backgroundColor: '#871919ff',
    borderRadius: 4,
  },
  notificationTitle: { 
    fontSize: 16, 
    fontWeight: 'bold',
    color: '#333333',
  },
  notificationMessage: { 
    fontSize: 14, 
    marginTop: 4,
    color: '#555555',
  },
  notificationTimestamp: { 
    fontSize: 12, 
    color: '#888888', 
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyMessage: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 16,
    color: '#7e7d7dff',
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  }
});

export default styles;