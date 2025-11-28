import React from "react";
import {Image, ScrollView, StyleSheet, Text, View,} from "react-native";
import AppHeader from "../components/AppHeader";

export default function GraphScreen() {
    const [showModal, setShowModal] = useState(false);
    const toggleModal = () => setShowModal(!showModal);

    return (
        <View style={styles.page}>
            <ScrollView contentContainerStyle={styles.scrollArea}>
                <AppHeader/>
                <View style={styles.cardSection}>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Gastos e Ingresos</Text>
                        <Image
                            style={styles.image}
                            source={require("../assets/gastos-ingresos.png")}
                        />
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Gastos</Text>
                        <Image
                            style={[styles.image, {height: 270}]}
                            source={require("../assets/gastos.png")}
                        />

                        <Text style={styles.sectionTitle}>Categorías</Text>

                        <View style={styles.row}>
                            <View style={styles.circle}/>
                            <Text style={styles.name}>Escuela</Text>
                            <View style={styles.rightContainer}>
                                <Text style={styles.money}>$5,091.00</Text>
                                <Text style={styles.note}>70% del
                                                          presupuesto</Text>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.circle}/>
                            <Text style={styles.label}>Renta</Text>
                            <View style={styles.rightContainer}>
                                <Text style={styles.money}>$5,091.00</Text>
                                <Text style={styles.note}>100% del
                                                          presupuesto</Text>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.circle}/>
                            <Text style={styles.name}>Comida</Text>
                            <View style={styles.rightContainer}>
                                <Text style={styles.money}>$4,242.50</Text>
                                <Text style={styles.note}>87% del
                                                          presupuesto</Text>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.circle}/>
                            <Text style={styles.name}>Transporte</Text>
                            <View style={styles.rightContainer}>
                                <Text style={styles.money}>$2,545.50</Text>
                                <Text style={styles.note}>99% del
                                                          presupuesto</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Ingresos</Text>
                        <Image
                            style={[styles.image, {height: 160}]}
                            source={require("../assets/ingresos.png")}
                        />

                        <Text style={styles.sectionTitle}>Categorías</Text>

                        <View style={styles.row}>
                            <View style={styles.circle}/>
                            <Text style={styles.name}>Salario</Text>
                            <Text style={styles.money}>$5,091.00</Text>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.circle}/>
                            <Text style={styles.name}>Otros</Text>
                            <Text style={styles.money}>$4,242.50</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <Navbar toggleModal={toggleModal}/>
            <CrudModal visible={showModal} setVisible={setShowModal}/>
        </View>
    );
}
const BG = "#D2EFEC";

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: BG
    },
    scrollArea: {
        paddingBottom: 80,
        // backgroundColor: '#338b84'
    },
    cardSection: {
        marginTop: -30,
        marginHorizontal: 16,
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 6,
    },
    card: {
        backgroundColor: "white",
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 40,
        marginBottom: 14,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: {width: 0, height: 2},
        elevation: 2,
    },
    cardTitle: {
        color: "#183236",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 10
    },
    image: {
        width: "100%",
        height: 150,
        resizeMode: "center",
        borderRadius: 12
    },
    sectionTitle: {
        color: "#0F6D66",
        fontWeight: "600",
        marginVertical: 8
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    circle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: "#0F6D66",
        marginRight: 8,
    },
    name: {
        flex: 1,
        color: "#1A1A1A"
    },
    label: {
        flex: 1,
        color: "#1A1A1A"
    },
    rightContainer: {
        alignItems: "flex-end"
    },
    money: {
        fontWeight: "600",
        color: "#1A1A1A"
    },
    note: {
        fontSize: 12,
        color: "#6A8B90"
    },
});