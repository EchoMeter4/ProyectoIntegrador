import React, {useState} from "react";
import {
    Alert,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function CrudModal({visible, setVisible}) {
    const [entryType, setEntryType] = useState("gasto");

    const onSave = () => {
        Alert.alert(`${entryType} guardado`);
    };

    return (
        <Modal animationType="slide" transparent visible={visible}>
            <Pressable
                onPress={() => setVisible(false)} style={styles.backdrop}
            />
            <View style={styles.modal}>
                <View style={styles.tabs}>
                    <TouchableOpacity
                        onPress={() => setEntryType("ingreso")}
                        style={[styles.tabBtn, entryType === "ingreso" && styles.tabBtnActive]}
                    >
                        <Text
                            style={[styles.tabText, entryType === "ingreso" && styles.tabTextActive]}
                        >
                            Ingreso
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setEntryType("gasto")}
                        style={[styles.tabBtn, entryType === "gasto" && styles.tabBtnActive]}
                    >
                        <Text
                            style={[styles.tabText, entryType === "gasto" && styles.tabTextActive]}
                        >
                            Gasto
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setEntryType("presupuesto")}
                        style={[styles.tabBtn, entryType === "presupuesto" && styles.tabBtnActive]}
                    >
                        <Text
                            style={[styles.tabText, entryType === "presupuesto" && styles.tabTextActive]}
                        >
                            Presupuesto
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.body}>
                    {entryType === "presupuesto" ? (
                        <>
                            <Text style={styles.sectionTitle}>Nombre</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Ej. Comida"
                                placeholderTextColor="#7A8F90"
                            />

                            <Text
                                style={[styles.sectionTitle, {marginTop: 14}]}
                            >Monto</Text>
                            <TextInput
                                style={styles.amountInput}
                                placeholder="$0.00"
                                placeholderTextColor="#7A8F90"
                                keyboardType="numeric"
                            />

                            <Text
                                style={[styles.sectionTitle, {marginTop: 16}]}
                            >
                                Seleccionar Ícono
                            </Text>
                            <View style={styles.chipsRow}>
                                <TouchableOpacity
                                    style={styles.chip}
                                    onPress={() => Alert.alert("Ícono: Escuela")}
                                >
                                    <Text style={styles.chipEmoji}>🎓</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.chip}
                                    onPress={() => Alert.alert("Ícono: Renta")}
                                >
                                    <Text style={styles.chipEmoji}>🏢</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.chip}
                                    onPress={() => Alert.alert("Ícono: Comida")}
                                >
                                    <Text style={styles.chipEmoji}>🍔</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.chip}
                                    onPress={() => Alert.alert("Ícono: Transporte")}
                                >
                                    <Text style={styles.chipEmoji}>🚌</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : entryType === "ingreso" ? (
                        <>
                            <Text style={styles.sectionTitle}>Monto</Text>
                            <TextInput
                                style={styles.amountInput}
                                placeholder="$0.00"
                                placeholderTextColor="#7A8F90"
                                keyboardType="numeric"
                            />

                            <Text
                                style={[styles.sectionTitle, {marginTop: 16}]}
                            >
                                Seleccionar Categoría
                            </Text>

                            <View style={styles.chipsRow}>
                                <TouchableOpacity
                                    style={styles.chip}
                                    onPress={() => Alert.alert("Categoría: Salario")}
                                >
                                    <Text style={styles.chipEmoji}>💼</Text>
                                    <Text style={styles.chipText}>Salario</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.chip}
                                    onPress={() => Alert.alert("Categoría: Otros")}
                                >
                                    <Text style={styles.chipEmoji}>➕</Text>
                                    <Text style={styles.chipText}>Otros</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <>
                            <Text style={styles.sectionTitle}>Monto</Text>
                            <TextInput
                                style={styles.amountInput}
                                placeholder="$0.00"
                                placeholderTextColor="#7A8F90"
                                keyboardType="numeric"
                            />

                            <Text
                                style={[styles.sectionTitle, {marginTop: 16}]}
                            >
                                Seleccionar Categoría
                            </Text>

                            <View style={styles.chipsRow}>
                                <TouchableOpacity
                                    style={styles.chip}
                                    onPress={() => Alert.alert("Categoría: Escuela")}
                                >
                                    <Text style={styles.chipEmoji}>🎓</Text>
                                    <Text style={styles.chipText}>Escuela</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.chip}
                                    onPress={() => Alert.alert("Categoría: Renta")}
                                >
                                    <Text style={styles.chipEmoji}>🏢</Text>
                                    <Text style={styles.chipText}>Renta</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.chip}
                                    onPress={() => Alert.alert("Categoría: Comida")}
                                >
                                    <Text style={styles.chipEmoji}>🍔</Text>
                                    <Text style={styles.chipText}>Comida</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.chip}
                                    onPress={() => Alert.alert("Categoría: Transporte")}
                                >
                                    <Text style={styles.chipEmoji}>🚌</Text>
                                    <Text
                                        style={styles.chipText}
                                    >Transporte</Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.sectionTitle}>Agregar
                                                              Nota</Text>
                            <TextInput
                                style={styles.noteInput}
                                placeholder="Opcional..."
                                placeholderTextColor="#7A8F90"
                                multiline
                            />
                        </>
                    )}

                    <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
                        <Text style={styles.saveText}>Guardar</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </Modal>
    );
}

const GREEN = "#0F6D66";
const BORDER = "#E6ECEC";

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.25)",
    },
    modal: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        paddingTop: 12,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    tabs: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderColor: BORDER,
        paddingBottom: 10,
        marginBottom: 12,
    },
    tabBtn: {paddingVertical: 6, flex: 1, alignItems: "center"},
    tabBtnActive: {},
    tabText: {color: GREEN, fontWeight: "600", opacity: 0.7},
    tabTextActive: {opacity: 1, textDecorationLine: "underline"},
    body: {paddingBottom: 40},
    sectionTitle: {color: GREEN, fontWeight: "700", marginBottom: 6},
    textInput: {
        borderWidth: 1,
        borderColor: BORDER,
        borderRadius: 14,
        height: 52,
        paddingHorizontal: 16,
        color: "#152A2E",
    },
    amountInput: {
        width: "100%",
        height: 64,
        borderWidth: 1,
        borderColor: BORDER,
        borderRadius: 16,
        paddingHorizontal: 16,
        fontSize: 26,
        fontWeight: "800",
        color: "#152A2E",
    },
    chipsRow: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginTop: 8,
        marginBottom: 16
    },
    chip: {
        width: 78,
        backgroundColor: "#F6FAFA",
        borderWidth: 1,
        borderColor: BORDER,
        borderRadius: 14,
        paddingVertical: 10,
        alignItems: "center",
    },
    chipEmoji: {fontSize: 18, marginBottom: 4},
    chipText: {fontSize: 12, color: "#2A3C3F"},
    noteInput: {
        borderWidth: 1,
        borderColor: BORDER,
        borderRadius: 12,
        minHeight: 60,
        padding: 12,
        color: "#2A3C3F",
        marginTop: 8,
        marginBottom: 16,
    },
    saveBtn: {
        backgroundColor: GREEN,
        height: 52,
        borderRadius: 26,
        alignItems: "center",
        justifyContent: "center",
    },
    saveText: {color: "white", fontWeight: "700"},
});