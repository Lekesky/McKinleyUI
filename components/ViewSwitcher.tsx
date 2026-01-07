import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import styles from '../styles/Components/ViewSwitcher.styles';

interface ViewSwitchProps {
  values: string[];
  selectedIndex?: number;
  onChange?: (index: number) => void;
  width?: number;
  height?: number;
  activeColor?: string;
  inactiveColor?: string;
  textColor?: string;
  activeTextColor?: string;
  borderRadius?: number;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

const ViewControl: React.FC<ViewSwitchProps> = ({
  values,
  selectedIndex = 0,
  onChange = () => {},
  width = 200,
  height = 40,
  activeColor = '#fff',
  inactiveColor = '#ccc',
  textColor = '#333',
  activeTextColor = '#000',
  borderRadius = 20,
  textStyle,
  containerStyle,
}) => {
  const [selected, setSelected] = useState<number>(selectedIndex);
  const translateX = useRef(new Animated.Value(selectedIndex * (width / values.length))).current;

  const segmentWidth = width / values.length;
  const indicatorPadding = 4;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: selected * segmentWidth + indicatorPadding,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [selected, segmentWidth, translateX]);

  const handlePress = (index: number) => {
    if (index !== selected) {
      setSelected(index);
      onChange(index);
    }
  };

  return (
    <View
      style={[
        styles.segmentContainer,
        {
          width,
          height,
          borderRadius,
          backgroundColor: inactiveColor,
        },
        containerStyle,
      ]}
    >
      {/* Sliding indicator */}
      <Animated.View
        style={[
          styles.slider,
          {
            width: segmentWidth - (indicatorPadding * 2),
            height: height - (indicatorPadding * 2),
            backgroundColor: activeColor,
            borderRadius: borderRadius - indicatorPadding,
            transform: [{ translateX }],
          },
        ]}
      />

      {values.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.segment,
            {
              width: segmentWidth,
              height,
            },
          ]}
          onPress={() => handlePress(index)}
          accessibilityRole="button"
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.segmentText,
              {
                color: selected === index ? activeTextColor : textColor,
                fontWeight: selected === index ? 'bold' : 'normal',
              },
              textStyle,
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ViewControl;
