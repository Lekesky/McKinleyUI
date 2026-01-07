import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { View } from 'react-native';

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <View style={{ overflow: 'hidden', borderRadius: 30 }}>
      <PlatformPressable
        {...props}
        android_ripple={{ color: 'transparent' }}
        pressColor="transparent"
        style={[props.style, { overflow: 'hidden' }]}
        onPressIn={(ev) => {
          if (process.env.EXPO_OS === 'ios') {
            // Add a soft haptic feedback when pressing down on the tabs.
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          props.onPressIn?.(ev);
        }}
      />
    </View>
  );
}
