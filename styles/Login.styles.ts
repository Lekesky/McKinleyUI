import { Platform, StyleSheet } from 'react-native';

const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffffff',
    ...(isWeb && {
      // @ts-ignore
      '@media (min-width: 768px)': {
        justifyContent: 'center',
        alignItems: 'center',
      },
    }),
  },
  formWrapper: {
    ...(isWeb && {
      // @ts-ignore
      '@media (min-width: 768px)': {
        width: '100%',
        maxWidth: 480,
        padding: 40,
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
      },
    }),
  },
  backButton: {
    marginTop: 50,
    backgroundColor: '#e8e8e8ff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    ...(isWeb && {
      // @ts-ignore
      '@media (min-width: 768px)': {
        marginTop: 0,
        marginBottom: 20,
      },
      // @ts-ignore
      '@media (max-width: 480px)': {
        marginTop: 30,
        width: 45,
        height: 45,
      },
    }),
  },
  header: {
    marginTop: 20,
    fontFamily: 'Helvetica',
    fontSize: 30,
    color: '#871919ff',
    fontWeight: 'bold',
    ...(isWeb && {
      // @ts-ignore
      '@media (min-width: 768px)': {
        marginTop: 10,
        fontSize: 36,
        textAlign: 'center',
      },
      // @ts-ignore
      '@media (max-width: 480px)': {
        fontSize: 26,
        marginTop: 15,
      },
    }),
  },
  form: {
    marginTop: 10,
    ...(isWeb && {
      // @ts-ignore
      '@media (min-width: 768px)': {
        marginTop: 30,
      },
    }),
  },
  textInput: {
    marginBottom: 15,
    backgroundColor: '#e8e8e8ff',
    height: 58,
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 480px)': {
        height: 52,
      },
    }),
  },
  textInputOutline: {
    borderRadius: 30,
    borderWidth: 0,
  },
  loginButton: {
    backgroundColor: '#871919ff',
    marginTop: 20,
    height: 58,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 480px)': {
        height: 52,
        marginTop: 15,
      },
    }),
  },
  continueWith: {
    marginTop: 20,
    marginBottom: 5,
    textAlign: 'center',
    color: '#3c3c3cff',
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
    fontSize: 16,
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 480px)': {
        fontSize: 14,
        marginTop: 15,
      },
    }),
  },
  socialButton: {
    backgroundColor: '#e8e8e8ff',
    marginTop: 15,
    height: 58,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 480px)': {
        height: 52,
        marginTop: 12,
      },
    }),
  },
  accountText: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 480px)': {
        marginTop: 20,
      },
    }),
  },
});

export default styles;