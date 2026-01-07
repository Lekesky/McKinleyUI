import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffffff',
    },
    header: {
        marginBottom: "10%",
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
    orderList: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 100,
    },
    emptyMessage: {
        textAlign: 'center',
        fontSize: 18,
        color: '#6b7280',
        fontWeight: '500',
        lineHeight: 24,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 80,
        paddingHorizontal: 32,
    },
    emptyIcon: {
        marginBottom: 16,
        opacity: 0.4,
    },
    emptySubtext: {
        textAlign: 'center',
        fontSize: 14,
        color: '#9ca3af',
        marginTop: 8,
        lineHeight: 20,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    loadingText: {
        marginTop: 16,
        color: '#6b7280',
        fontSize: 16,
        fontWeight: '500',
    },
    loadingMore: {
        paddingVertical: 24,
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    loadingMoreText: {
        color: '#6b7280',
        fontSize: 14,
        marginTop: 8,
        fontWeight: '500',
    },
});

export default styles;