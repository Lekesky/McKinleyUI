import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // Section header styling
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8
  },

  // Header row for icons and title
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Total count text
  totalCount: {
    color: '#666',
    fontSize: 12,
  },

  // Section container
  sectionContainer: {
    marginBottom: 20,
  },

  // Subtitle text
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#871919ff',
    marginBottom: 10,
    marginTop: 15,
    fontFamily: 'Helvetica',
  },

  // User card styling
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  // Avatar styling
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  // User info container
  userInfo: {
    flex: 1,
  },

  // User name text
  userName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
  },

  // Role container
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  // User role badge
  userRole: {
    fontSize: 13,
    color: '#871919ff',
    fontWeight: '600',
    backgroundColor: '#f8eaea',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 8,
  },

  // Me badge
  meBadge: {
    backgroundColor: '#871919ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8
  },

  meBadgeText: {
    color: '#fff',
    fontSize: 12,
  },

  // Empty state container
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },

  // Dropdown styling
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 100
  },

  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee'
  },

  dropdownItemText: {
    fontSize: 16,
    color: '#333'
  },

  // User icon styling
  userIcon: {
    backgroundColor: '#f0f0f0',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  // Empty message
  emptyMessage: {
    padding: 15,
    textAlign: 'center',
    color: '#7e7d7dff',
    fontFamily: 'Helvetica',
  },
});

export default styles;