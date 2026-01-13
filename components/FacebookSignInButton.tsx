import React from 'react';
import { Image, Pressable, StyleSheet, ViewStyle } from 'react-native';

interface FacebookSignInButtonProps {
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

export default function FacebookSignInButton({ onPress, style, disabled = false }: FacebookSignInButtonProps) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={[styles.button, style, disabled && styles.disabled]}
      disabled={disabled}
    >
      <Image
        source={require('../assets/images/Facebook_Logo_Primary.png')}
        style={styles.icon}
        resizeMode="contain"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
  disabled: {
    opacity: 0.4,
  },
});
