import { Platform, StyleSheet } from 'react-native';

const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create({
    enterBoxStyle: {
        backgroundColor: "#53c851",
        color: "white",
        textAlign: "center",
        textAlignVertical: "center",
        fontSize: 20,
        height: 35,
        width: "auto",
        borderRadius: 20,
        ...(isWeb && {
            // @ts-ignore
            '@media (max-width: 768px)': {
                fontSize: 18,
                height: 32,
            },
        }),
    },
    picker: {
        borderWidth: 2,
        height: 50,
        width: 150,
        marginLeft: 10,
        ...(isWeb && {
            // @ts-ignore
            '@media (max-width: 768px)': {
                height: 44,
                width: 130,
                marginLeft: 8,
            },
        }),
    },
    textBox: {
        marginLeft: 15,
        borderWidth: 2,
        width: 50,
        height: 50,
        alignSelf: "center",
        ...(isWeb && {
            // @ts-ignore
            '@media (max-width: 768px)': {
                width: 44,
                height: 44,
                marginLeft: 12,
            },
        }),
    },
    tableNum: {
        fontSize: 30,
        color: '#000',
        ...(isWeb && {
            // @ts-ignore
            '@media (max-width: 768px)': {
                fontSize: 24,
            },
        }),
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tableBox: {
        flexDirection: 'row',
    },
    enterBox: {
        marginTop: 30,
        width: 350,
    },
    box: {
        padding: 20,
        borderRadius: 8,
    },
    title: {
        textAlign: "center",
        fontSize: 60,
        fontWeight: 'bold',
        alignItems: "center",
        color: '#000',
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default styles;