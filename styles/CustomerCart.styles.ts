import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    menuItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginHorizontal: 0,
        marginVertical: 8,
        padding: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
    },
    menuItemImageContainer: {
        width: 72,
        height: 72,
        borderRadius: 8,
        overflow: 'hidden',
        marginRight: 12,
        backgroundColor: '#f4f4f4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuItemImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    menuItemDetailsContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    menuItemName: {
        marginBottom: 6,
    },
    quantityPriceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    quantityPrice: {
        justifyContent: 'center',
    },
    plusMinusButton: {
        backgroundColor: '#871919ff',
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuItemPriceContainer: {
        width: 80,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    summary: {
        marginTop: 12,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
    },
    summaryColumn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
    },
    checkoutButton: {
        marginTop: 12,
        backgroundColor: '#871919ff',
        paddingVertical: 14,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default styles;