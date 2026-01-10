import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Hero Section
  hero: {
    height: isWeb ? 600 : 500,
    backgroundColor: '#871919ff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 768px)': {
        height: 450,
        paddingHorizontal: 16,
      },
      // @ts-ignore
      '@media (max-width: 480px)': {
        height: 400,
      },
    }),
  },
  heroImageRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    flexDirection: 'row',
    height: '100%',
  },
  heroImageContainer: {
    width: width, // Full viewport width
    height: '100%',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    minWidth: '100%',
    minHeight: '100%',
  },
  heroContent: {
    maxWidth: 900,
    alignItems: 'center',
    zIndex: 2,
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 768px)': {
        maxWidth: '100%',
      },
    }),
  },
  heroTextBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingVertical: 40,
    paddingHorizontal: 60,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 40,
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 768px)': {
        paddingVertical: 30,
        paddingHorizontal: 30,
        marginBottom: 30,
      },
      // @ts-ignore
      '@media (max-width: 480px)': {
        paddingVertical: 20,
        paddingHorizontal: 20,
        marginBottom: 20,
      },
    }),
  },
  // Pagination
  paginationContainer: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    gap: 12,
    zIndex: 3,
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 768px)': {
        bottom: 20,
        gap: 8,
      },
    }),
  },
  paginationDot: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 768px)': {
        height: 10,
        borderRadius: 5,
      },
    }),
  },
  heroTitle: {
    fontSize: isWeb ? 64 : 42,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Helvetica',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 15,
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 768px)': {
        fontSize: 40,
        marginBottom: 16,
      },
      // @ts-ignore
      '@media (max-width: 480px)': {
        fontSize: 32,
        marginBottom: 12,
      },
    }),
  },
  heroSubtitle: {
    fontSize: isWeb ? 20 : 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 0,
    lineHeight: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 12,
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 768px)': {
        fontSize: 16,
        lineHeight: 24,
      },
      // @ts-ignore
      '@media (max-width: 480px)': {
        fontSize: 14,
        lineHeight: 20,
      },
    }),
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 768px)': {
        gap: 12,
      },
    }),
  },
  primaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    minWidth: 180,
    alignItems: 'center',
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 768px)': {
        minWidth: 150,
        paddingVertical: 14,
        paddingHorizontal: 24,
      },
      // @ts-ignore
      '@media (max-width: 480px)': {
        minWidth: 130,
        paddingVertical: 12,
        paddingHorizontal: 20,
      },
    }),
  },
  primaryButtonText: {
    color: '#871919ff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Helvetica',
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 768px)': {
        fontSize: 14,
      },
    }),
  },
  secondaryButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
    minWidth: 180,
    alignItems: 'center',
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 768px)': {
        minWidth: 150,
        paddingVertical: 14,
        paddingHorizontal: 24,
      },
      // @ts-ignore
      '@media (max-width: 480px)': {
        minWidth: 130,
        paddingVertical: 12,
        paddingHorizontal: 20,
      },
    }),
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Helvetica',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 768px)': {
        fontSize: 14,
      },
    }),
  },
  // Welcome Section
  welcomeSection: {
    paddingVertical: 80,
    paddingHorizontal: isWeb ? 80 : 20,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 768px)': {
        paddingVertical: 50,
        paddingHorizontal: 20,
      },
      // @ts-ignore
      '@media (max-width: 480px)': {
        paddingVertical: 40,
        paddingHorizontal: 16,
      },
    }),
  },
  sectionTitle: {
    fontSize: isWeb ? 36 : 28,
    fontWeight: 'bold',
    color: '#871919ff',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Helvetica',
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 768px)': {
        fontSize: 28,
        marginBottom: 20,
      },
      // @ts-ignore
      '@media (max-width: 480px)': {
        fontSize: 24,
        marginBottom: 16,
      },
    }),
  },
  welcomeText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: 800,
    alignSelf: 'center',
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 768px)': {
        fontSize: 16,
        lineHeight: 24,
      },
    }),
  },
  // Featured Section
  featuredSection: {
    paddingVertical: 60,
    paddingHorizontal: isWeb ? 80 : 20,
    backgroundColor: '#f8f8f8',
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 768px)': {
        paddingVertical: 40,
        paddingHorizontal: 20,
      },
      // @ts-ignore
      '@media (max-width: 480px)': {
        paddingVertical: 30,
        paddingHorizontal: 16,
      },
    }),
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: isWeb ? 24 : 16,
    maxWidth: 1400,
    alignSelf: 'center',
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 768px)': {
        gap: 16,
      },
    }),
  },
  menuCard: {
    width: isWeb ? 340 : width - 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 1024px)': {
        width: 300,
      },
      // @ts-ignore
      '@media (max-width: 768px)': {
        width: '100%',
        maxWidth: 400,
      },
    }),
  },
  menuImage: {
    height: 180,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center',
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 768px)': {
        height: 160,
      },
    }),
  },
  imagePlaceholder: {
    fontSize: 64,
  },
  menuCardContent: {
    padding: 16,
  },
  menuItemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 768px)': {
        fontSize: 18,
      },
    }),
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  menuItemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#871919ff',
  },
  // Info Section
  infoSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 32,
    paddingVertical: 80,
    paddingHorizontal: isWeb ? 80 : 20,
    backgroundColor: '#fff',
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 768px)': {
        paddingVertical: 40,
        paddingHorizontal: 20,
        gap: 20,
      },
    }),
  },
  infoCard: {
    width: isWeb ? 320 : '100%',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 768px)': {
        width: '100%',
        padding: 24,
      },
    }),
  },
  infoIcon: {
    fontSize: 48,
    marginBottom: 16,
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 768px)': {
        fontSize: 40,
      },
    }),
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#871919ff',
    marginBottom: 16,
    fontFamily: 'Helvetica',
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 768px)': {
        fontSize: 18,
      },
    }),
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 6,
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 768px)': {
        fontSize: 14,
      },
    }),
  },
  infoButton: {
    marginTop: 16,
    backgroundColor: '#871919ff',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  infoButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  // CTA Section
  ctaSection: {
    backgroundColor: '#871919ff',
    paddingVertical: 80,
    paddingHorizontal: isWeb ? 80 : 20,
    alignItems: 'center',
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 768px)': {
        paddingVertical: 50,
        paddingHorizontal: 20,
      },
    }),
  },
  ctaTitle: {
    fontSize: isWeb ? 42 : 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Helvetica',
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 768px)': {
        fontSize: 32,
      },
      // @ts-ignore
      '@media (max-width: 480px)': {
        fontSize: 28,
      },
    }),
  },
  ctaText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.95,
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 768px)': {
        fontSize: 16,
        marginBottom: 24,
      },
    }),
  },
  ctaButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 25,
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 768px)': {
        paddingVertical: 14,
        paddingHorizontal: 32,
      },
    }),
  },
  ctaButtonText: {
    color: '#871919ff',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Helvetica',
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 768px)': {
        fontSize: 16,
      },
    }),
  },
  // Footer
  footer: {
    backgroundColor: '#f8f8f8',
    paddingVertical: 32,
    alignItems: 'center',
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 768px)': {
        paddingVertical: 24,
      },
    }),
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
});

export default styles;