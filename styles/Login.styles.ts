import { Platform, StyleSheet } from 'react-native';

const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create({
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    ...(isWeb && {
      // @ts-ignore
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
    }),
  } as any,
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: '90%',
    maxWidth: 900,
    maxHeight: '90%',
    overflow: 'hidden',
    zIndex: 10000,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  modalContent: {
    flexDirection: 'row',
  } as any,

  // Logo section
  logoSection: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  logo: {
    width: '100%',
    height: 300,
    maxWidth: 300,
  },

  // Form section
  formSection: {
    flex: 1.2,
    padding: 40,
    justifyContent: 'center',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 30,
    textAlign: 'left',
  },

  // Form inputs
  form: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 6,
    marginTop: 8,
  },
  textInput: {
    marginBottom: 8,
    backgroundColor: '#ffffff',
    height: 50,
  },
  textInputOutline: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d0d0d0',
  },

  // Button
  loginButton: {
    backgroundColor: '#8B1A1A',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Divider
  dividerText: {
    textAlign: 'center',
    color: '#666666',
    fontSize: 14,
    marginVertical: 20,
  },

  // Social buttons
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },

  // Sign up prompt
  signupPrompt: {
    marginTop: 15,
    alignItems: 'center',
  },
  promptText: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
  },
  linkText: {
    color: '#8B1A1A',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default styles;
