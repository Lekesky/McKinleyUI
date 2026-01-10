import { Platform, StyleSheet } from 'react-native';

const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create({
    orderList: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 100,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 80,
        paddingHorizontal: 32,
        ...(isWeb && {
            '@media (max-width: 768px)': {
                paddingVertical: 60,
                paddingHorizontal: 24,
            },
        } as any),
    },
    emptyIcon: {
        marginBottom: 16,
        opacity: 0.4,
    },
    emptyIconText: {
        fontSize: 64,
    },
    emptyMessage: {
        textAlign: 'center',
        fontSize: 18,
        color: '#6b7280',
        fontWeight: '500',
        lineHeight: 24,
        fontFamily: 'Helvetica',
        ...(isWeb && {
            '@media (max-width: 768px)': {
                fontSize: 16,
                lineHeight: 22,
            },
        } as any),
    },
    emptySubtext: {
        textAlign: 'center',
        fontSize: 14,
        color: '#9ca3af',
        marginTop: 8,
        lineHeight: 20,
        fontFamily: 'Helvetica',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
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
        fontFamily: 'Helvetica',
    },
    loadingMore: {
        paddingVertical: 24,
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    loadingMoreText: {
        color: '#6b7280',
        fontSize: 14,
        marginTop: 8,
        fontWeight: '500',
        fontFamily: 'Helvetica',
    },
});

export default styles;