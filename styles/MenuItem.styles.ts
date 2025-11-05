import { Dimensions, StyleSheet } from 'react-native';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 10,
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    image: {
        width: width,
        // height: width * 0.75,
        height: 530,
    },
    contentContainer: {
        marginTop: -35,
        height: "100%",
        padding: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        backgroundColor: '#fff',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        borderRadius: 35,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
    },
    price: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#871919ff',
    },
    divider: {
        marginVertical: 15,
        backgroundColor: '#e0e0e0',
        height: 1,
    },
    descriptionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#555',
    },
    quantityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 20,
    },
    quantityLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        margin: 0,
        backgroundColor: '#f0f0f0',
    },
    quantityText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 10,
        minWidth: 24,
        textAlign: 'center',
    },
    bottomButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 30,
    },
    addToCartButton: {
        paddingVertical: 8,
        backgroundColor: '#871919ff',
    },
});

export default styles;