import {Alert, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {MaterialIcons} from "@expo/vector-icons";

export default function AppHeader() {
    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Resumen</Text>
            <Text style={styles.headerSubtitle}>
                &lt; Noviembre 2025 &gt;
            </Text>
            <TouchableOpacity
                onPress={() => Alert.alert('Configuración')}
                style={styles.iconConfig}
            >
                <MaterialIcons name="settings" size={22} color="#ffffff"/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        alignItems: "center",
        backgroundColor: "#338B84",
        paddingTop: 60,
        paddingBottom: 25,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold", color: "white"
    },
    headerSubtitle: {
        color: "white"
    },
    iconConfig: {
        position: 'absolute',
        right: 30,
        top: 70,
    },
})