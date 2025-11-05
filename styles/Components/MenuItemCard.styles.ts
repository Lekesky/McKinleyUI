import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    cardContainer: {
    width: '47%',
    margin: 5,
  },
  card: {
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  image: {
    height: 120,
    width: '100%',
  },
  contentContainer: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    lineHeight: 16,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#871919ff',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 10,
    color: '#333',
  },
});

export default styles;