import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    width: '100%',
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
    zIndex: 1000,
  },
  brandContainer: {
    flex: 1,
  },
  brand: {
    fontSize: 20,
    fontWeight: '700',
    color: '#871919',
  },
  links: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  profileLink: {
    borderWidth: 1,
    borderColor: '#871919',
    borderRadius: 4,
  },
  linkButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  linkButtonActive: {
    borderBottomColor: '#871919',
  },
  linkText: {
    fontSize: 16,
    color: '#333',
  },
  linkTextActive: {
    color: '#871919',
    fontWeight: '600',
  },
  actions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  actionText: {
    color: '#871919',
  },
  actionButtonPrimary: {
    backgroundColor: '#871919',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  actionTextPrimary: {
    color: '#fff',
  },
});
