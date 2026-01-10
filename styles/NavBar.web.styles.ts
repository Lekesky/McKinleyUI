import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
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
    ...(Platform.OS === 'web' && {
      // @ts-ignore - React Native Web supports media queries
      '@media (max-width: 768px)': {
        paddingHorizontal: 16,
        height: 60,
      },
    }),
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
    ...(Platform.OS === 'web' && {
      // @ts-ignore
      '@media (max-width: 1024px)': {
        gap: 12,
      },
    }),
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    ...(Platform.OS === 'web' && {
      // @ts-ignore
      '@media (max-width: 768px)': {
        width: 50,
        height: 50,
      },
    }),
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
    ...(Platform.OS === 'web' && {
      // @ts-ignore
      '@media (max-width: 1024px)': {
        paddingHorizontal: 8,
      },
    }),
  },
  linkButtonActive: {
    borderBottomColor: '#871919',
  },
  linkText: {
    fontSize: 16,
    color: '#333',
    ...(Platform.OS === 'web' && {
      // @ts-ignore
      '@media (max-width: 1024px)': {
        fontSize: 14,
      },
    }),
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
  // Mobile Menu Styles
  hamburger: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileMenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  mobileMenuContainer: {
    backgroundColor: '#ffffff',
    minHeight: 300,
    maxHeight: '85%',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mobileMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  closeButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  mobileMenuContent: {
    padding: 16,
  },
  mobileMenuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  mobileMenuItemActive: {
    backgroundColor: '#fff5f5',
    borderLeftWidth: 4,
    borderLeftColor: '#871919',
  },
  mobileMenuText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  mobileMenuTextActive: {
    color: '#871919',
    fontWeight: '700',
  },
  mobileMenuActions: {
    marginTop: 24,
    gap: 12,
    paddingHorizontal: 20,
  },
  mobileActionButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#871919',
    alignItems: 'center',
  },
  mobileActionText: {
    color: '#871919',
    fontSize: 16,
    fontWeight: '600',
  },
  mobileActionButtonPrimary: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#871919',
    alignItems: 'center',
  },
  mobileActionTextPrimary: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default styles;
