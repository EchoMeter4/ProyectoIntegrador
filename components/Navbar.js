import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";

export default function navbar({toggleModal, currentRoute}) {
    const navigation = useNavigation();

    return (
        <View style={styles.bottomWrap}>
            <View style={styles.bottomNav}>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => navigation.navigate('Operaciones')}
                >
                    <View style={[styles.iconBubble, currentRoute === 'Operaciones' && styles.iconBubbleActive]}>
                        <Text style={styles.iconText}>≡</Text>
                    </View>
                    <Text style={[styles.navLabel, currentRoute === 'Operaciones' && styles.navLabelActive]}>Ops</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => navigation.navigate('Dashboard')}
                >
                    <View style={[styles.iconBubble, currentRoute === 'Dashboard' && styles.iconBubbleActive]}>
                        <Text style={styles.iconText}>📊</Text>
                    </View>
                    <Text
                        style={[styles.navLabel, currentRoute === 'Dashboard' && styles.navLabelActive]}
                    >
                        Dashboard
                    </Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => navigation.navigate('Presupuestos')}
                >
                    <View style={[styles.iconBubble, currentRoute === 'Presupuestos' && styles.iconBubbleActive]}>
                        <Text style={styles.iconText}>📦</Text>
                    </View>
                    <Text style={[styles.navLabel, currentRoute === 'Presupuestos' && styles.navLabelActive]}>Presus</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

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
        left: 30,
        right: 30,
        bottom: 20,
    },
    bottomNav: {
        backgroundColor: "rgba(238, 243, 243, 0.97)",
        borderRadius: 22,
        paddingVertical: 10,
        paddingHorizontal: 14,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    divider: {
        width: 1,
        height: 30,
        backgroundColor: '#D0DEDD',
        marginHorizontal: 4,
        alignSelf: 'center',
    },
});
