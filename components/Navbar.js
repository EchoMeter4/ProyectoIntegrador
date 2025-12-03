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
                    <Text style={[styles.navLabel, currentRoute === 'Operaciones' && styles.navLabelActive]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
                        Operaciones
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => navigation.navigate('Presupuestos')}
                >
                    <View style={[styles.iconBubble, currentRoute === 'Presupuestos' && styles.iconBubbleActive]}>
                        <Text style={styles.iconText}>📦</Text>
                    </View>
                    <Text style={[styles.navLabel, currentRoute === 'Presupuestos' && styles.navLabelActive]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
                        Presupuestos
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => navigation.navigate('Dashboard')}
                >
                    <View style={[styles.iconBubble, currentRoute === 'Dashboard' && styles.iconBubbleActive]}>
                        <Text style={styles.iconText}>📊</Text>
                    </View>
                    <Text
                        style={[styles.navLabel, currentRoute === 'Dashboard' && styles.navLabelActive]}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        minimumFontScale={0.8}
                    >
                        Dashboard
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navItem} onPress={() => toggleModal()}
                >
                    <View style={styles.iconBubble}>
                        <Text style={styles.iconText}>＋</Text>
                    </View>
                    <Text style={styles.navLabel} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>Agregar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    navLabel: {
        fontSize: 11,
        color: "#0D2230",
        textAlign: 'center',
        flexWrap: 'nowrap',
        includeFontPadding: false,
        flexShrink: 1,
    },
    navLabelActive: {
        fontWeight: "600"
    },
    iconBubble: {
        width: 40,
        height: 32,
        borderRadius: 12,
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 2,
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
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 4,
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
        paddingHorizontal: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        columnGap: 4,
    },
});
