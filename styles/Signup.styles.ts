import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffffff',
  },

  backButton: {
    marginTop: 50,
    backgroundColor: '#e8e8e8ff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    marginTop: 20,
    fontFamily: 'Helvetica',
    fontSize: 30,
    color: '#871919ff',
    fontWeight: 'bold',
  },

  form: {
    marginTop: 10,
  },

  textInput: {
    marginBottom: 15,
    backgroundColor: '#e8e8e8ff',
    height: 58,
  },

  textInputOutline: {
    borderRadius: 30,
    borderWidth: 0,
  },

  signupButton: {
    backgroundColor: '#871919ff',
    marginTop: 20,
    height: 58,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  continueWith: {
    marginTop: 20,
    marginBottom: 5,
    textAlign: 'center',
    color: '#3c3c3cff',
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
    fontSize: 16,
  },

  socialButton: {
    backgroundColor: '#e8e8e8ff',
    marginTop: 15,
    height: 58,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  accountText: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;