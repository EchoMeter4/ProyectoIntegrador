import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export default function navbar({toggleModal}) {
    return (
        <View style={styles.bottomWrap}>
            <View style={styles.bottomNav}>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => Alert.alert("Grafica")}
                >
                    <View style={styles.iconBubble}>
                        <Text style={styles.iconText}>≡</Text>
                    </View>
                    <Text style={styles.navLabel}>Lista</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => Alert.alert("Grafica")}
                >
                    <View style={[styles.iconBubble, styles.iconBubbleActive]}>
                        <Text style={styles.iconText}>📊</Text>
                    </View>
                    <Text
                        style={[styles.navLabel, styles.navLabelActive]}
                    >
                        Gráficas
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navItem} onPress={() => toggleModal()}
                >
                    <View style={styles.iconBubble}>
                        <Text style={styles.iconText}>＋</Text>
                    </View>
                    <Text style={styles.navLabel}>Agregar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    navLabel: {
        fontSize: 12,
        color: "#0D2230"
    },
    navLabelActive: {
        fontWeight: "600"
    },
    iconBubble: {
        width: 44,
        height: 36,
        borderRadius: 12,
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 4,
    },
    iconBubbleActive: {
        backgroundColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 6,
        shadowOffset: {width: 0, height: 2},
        elevation: 3,
    },
    iconText: {
        fontSize: 18,
        color: "#0D2230"
    },
    navItem: {
        alignItems: "center",
        justifyContent: "center",
        width: "32%"
    },
    bottomWrap: {
        position: "absolute",
        left: 16,
        right: 16,
        bottom: 16,
    },
    bottomNav: {
        backgroundColor: "#EEF3F3",
        borderRadius: 22,
        paddingVertical: 10,
        paddingHorizontal: 14,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: {width: 0, height: 2},
        elevation: 4,
    },
});
