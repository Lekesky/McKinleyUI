import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  segmentContainer: {
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
  },
  segment: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  slider: {
    position: 'absolute',
    left: 0,
    top: 4,
    right: 4,
    bottom: 0,
  },
  segmentText: {
    fontSize: 14,
  },
});

export default styles;