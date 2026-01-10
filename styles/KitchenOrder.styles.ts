import { Platform, StyleSheet } from "react-native";

const isWeb = Platform.OS === 'web';

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
        backgroundColor: '#ffffffff',
        ...(isWeb && {
            '@media (max-width: 768px)': {
                padding: 16,
            },
        } as any),
    },
    header: {
        marginTop: 30,
        marginBottom: "1%",
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        ...(isWeb && {
            '@media (max-width: 768px)': {
                gap: 12,
                marginTop: 20,
            },
        } as any),
    },
    headerTitle: {
        fontSize: 24,
        color: '#871919ff',
        fontWeight: 'bold',
        fontFamily: 'Helvetica',
        ...(isWeb && {
            '@media (max-width: 768px)': {
                fontSize: 20,
            },
        } as any),
    },
    backButton: { 
        backgroundColor: '#e8e8e8ff', 
        width: 50, 
        height: 50, 
        borderRadius: 25, 
        justifyContent: 'center', 
        alignItems: 'center',
        ...(isWeb && {
            '@media (max-width: 768px)': {
                width: 44,
                height: 44,
                borderRadius: 22,
            },
        } as any),
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