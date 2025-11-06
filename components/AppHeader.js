import {StyleSheet, Text, View} from "react-native";
import React from "react";

export default function AppHeader() {
    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Resumen</Text>
            <Text style={styles.headerSubtitle}>
                &lt; Noviembre 2025 &gt;
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        alignItems: "center",
        backgroundColor: "#338B84",
        paddingTop: 60,
        paddingBottom: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold", color: "white"
    },
    headerSubtitle: {
        color: "white"
    },
})