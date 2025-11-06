import React, {useState} from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {Feather} from "@expo/vector-icons";
import Navbar from "../components/Navbar";
import CrudModal from "./CrudModal";
import AppHeader from "../components/AppHeader";

export default function PantallaTransacciones() {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
    const [operacion, setOperacion] = useState("editar");

    function alternarModal() {
        setTipoSeleccionado(undefined);
        setOperacion("crear");
        setMostrarModal(!mostrarModal);
    }

    const transacciones = [
        { tipo: "ingreso",  categoria: "Salario",    fecha: "02 de noviembre", monto: "$9,100.00" },
        { tipo: "gasto",    categoria: "Escuela",    fecha: "05 de noviembre", monto: "$91.00" },
        { tipo: "ingreso",  categoria: "Otros",      fecha: "10 de noviembre", monto: "$500.00" },
        { tipo: "gasto",    categoria: "Renta",      fecha: "15 de noviembre", monto: "$4,500.00" },
        { tipo: "presupuesto", categoria: "Comida",      fecha: "01 de noviembre", monto: "$3,000.00" },
        { tipo: "presupuesto", categoria: "Transporte",  fecha: "01 de noviembre", monto: "$1,000.00" },
        { tipo: "presupuesto", categoria: "Escuela",     fecha: "01 de noviembre", monto: "$2,500.00" },
        { tipo: "presupuesto", categoria: "Renta",       fecha: "01 de noviembre", monto: "$5,000.00" },
    ];

    const eliminar = () => Alert.alert("Eliminar", "Transacción eliminada (demo)");

    const editar = (t) => {
        setTipoSeleccionado(t.tipo);
        setOperacion("editar");
        setMostrarModal(true);
    };

    const etiquetaTipo = (t) =>
        t === "ingreso" ? "· Ingreso" : t === "gasto" ? "· Gasto" : "· Presupuesto";

    return (
        <View style={styles.pagina}>
            <ScrollView contentContainerStyle={styles.areaScroll} showsVerticalScrollIndicator={false}>
                <AppHeader/>

                <View style={styles.tarjetaLista}>
                    <View style={styles.encabezadoLista}>
                        <View style={styles.filtrosFila}>
                            <TouchableOpacity style={styles.botonDropdown}>
                                <Text style={styles.textoDropdown}>Categorías ▼</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.tiposSeleccionados}>
                            <View style={[styles.pildoraTipo, styles.pildoraActiva]}>
                                <Text style={styles.textoPildoraActiva}>Gasto</Text>
                            </View>
                            <View style={[styles.pildoraTipo, styles.pildoraActiva]}>
                                <Text style={styles.textoPildoraActiva}>Ingreso</Text>
                            </View>
                            <View style={[styles.pildoraTipo, styles.pildoraActiva]}>
                                <Text style={styles.textoPildoraActiva}>Presupuesto</Text>
                            </View>
                        </View>
                    </View>

                    {transacciones.map((item, idx) => (
                        <View key={idx} style={styles.fila}>
                            <View>
                                <Text style={styles.tituloTransaccion}>
                                    {item.categoria} {etiquetaTipo(item.tipo)}
                                </Text>
                                <Text style={styles.fechaTransaccion}>{item.fecha}</Text>
                            </View>

                            <View style={styles.derecha}>
                                <Text
                                    style={[
                                        styles.montoTransaccion,
                                        item.tipo === "ingreso"
                                            ? styles.montoIngreso
                                            : item.tipo === "gasto"
                                                ? styles.montoGasto
                                                : styles.montoPresupuesto
                                    ]}
                                >
                                    {item.monto}
                                </Text>

                                <View style={styles.iconos}>
                                    <TouchableOpacity onPress={eliminar} style={styles.toqueIcono}>
                                        <Feather name="trash-2" size={18} color="#0E7369" />
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => editar(item)} style={styles.toqueIcono}>
                                        <Feather name="edit-3" size={18} color="#0E7369" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <Navbar toggleModal={alternarModal}/>
            <CrudModal
                visible={mostrarModal}
                setVisible={setMostrarModal}
                operation={operacion}
                type={tipoSeleccionado}
            />
        </View>
    );
}

const VERDE = "#0F6D66";
const FONDO = "#D2EFEC";
const BORDE = "#E6ECEC";

const styles = StyleSheet.create({
    pagina: {
        flex: 1,
        backgroundColor: FONDO,
    },
    areaScroll: {
        paddingBottom: 80,
    },
    tarjetaLista: {
        backgroundColor: "#fff",
        marginTop: -15,
        marginHorizontal: 16,
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 16,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    encabezadoLista: {
        marginBottom: 8,
    },
    filtrosFila: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
    },
    botonDropdown: {
        flex: 1,
        backgroundColor: "#fff",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: BORDE,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    textoDropdown: {
        color: VERDE,
        fontWeight: "700",
        textAlign: "center",
    },
    tiposSeleccionados: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    pildoraTipo: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 8,
        marginHorizontal: 4,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: BORDE,
        backgroundColor: "#F6FAFA",
    },
    pildoraActiva: {
        backgroundColor: "#FFFFFF",
        borderColor: VERDE,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    textoPildoraActiva: {
        color: VERDE,
        fontWeight: "700",
    },
    fila: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderTopWidth: 1,
        borderColor: BORDE,
        paddingVertical: 12,
    },
    tituloTransaccion: {
        color: VERDE,
        fontWeight: "700",
        fontSize: 15,
    },
    fechaTransaccion: {
        color: "#6B8B8B",
        fontSize: 13,
    },
    derecha: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    montoTransaccion: {
        fontWeight: "700",
    },
    montoIngreso: {
        color: "#18794e",
    },
    montoGasto: {
        color: "#b42318",
    },
    montoPresupuesto: {
        color: VERDE,
    },
    iconos: {
        flexDirection: "row",
        gap: 10,
    },
    toqueIcono: {
        padding: 6,
        borderRadius: 8,
    },
});