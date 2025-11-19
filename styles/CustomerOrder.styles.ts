import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    loadingMore: {
        padding: 20,
        alignItems: 'center',
    },
    loadingMoreText: {
        color: '#666',
        fontSize: 14,
        marginTop: 5,
    },
    container: { 
        flex: 1, 
        padding: 20,
        backgroundColor: '#ffffffff' 
    },
    header: {
        marginTop: 30,
        marginBottom: "1%",
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    headerTitle: {
        fontSize: 24,
        color: '#871919ff',
        fontWeight: 'bold',
        fontFamily: 'Helvetica',
    },
    backButton: { 
        backgroundColor: '#e8e8e8ff', 
        width: 50, 
        height: 50, 
        borderRadius: 25, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    filterContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        marginTop: 20,
        gap: 20,
        alignSelf: 'center',
        justifyContent: 'space-between',
    },
    filterTab: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        minWidth: 80,
        alignItems: 'center',
    },
    activeFilterTab: {
        backgroundColor: '#871919ff',
    },
    filterTabText: {
        color: '#333',
        fontWeight: '500',
    },
    activeFilterTabText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    emptyMessage: {
        textAlign: 'center',
        fontSize: 16,
        color: '#7e7d7dff',
        fontWeight: 'bold',
        fontFamily: 'Helvetica',
    },
    loadMoreButton: {
        alignSelf: 'center',
        backgroundColor: '#871919ff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginVertical: 12,
    },
    loadMoreButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    flatListContainer: {
        paddingHorizontal: 8,
        paddingTop: 16,
        paddingBottom: 80,
        alignSelf: 'center',
        width: '100%',
    },
});

export default styles;