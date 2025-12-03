import React, {useState, useEffect} from "react"; 
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
import { formatCurrency } from '../utils/utils';

import { usePreferences } from "../components/PreferencesContext";
import { useTransactionsBridge } from "../components/TransactionsBridge";




export default function PantallaTransacciones() {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
    const [operacion, setOperacion] = useState("editar");
    const [transaccionAEditar, setTransaccionAEditar] = useState(null); 

    const { presupuesto } = usePreferences();
    
    
    const { 
        transacciones, 
        eliminarTransaccion, 
        activeFilter, 
        setActiveFilter,
        
    } = useTransactionsBridge();

    
    
    
    
    const parsearMonto = (value) => {
        const num = Number(value);
        return Number.isFinite(num) ? num : 0;
    };

    const totalGastos = transacciones
        .filter(t => t.tipo === 'gasto')
        .reduce((acc, item) => acc + parsearMonto(item.monto), 0);

    const limitePresupuesto = parseFloat(presupuesto);

    const estaExcedido = transacciones.length > 0 && limitePresupuesto > 0 && totalGastos > limitePresupuesto;

    
    useEffect(() => {
        if (estaExcedido) {
            Alert.alert(
                "⚠️ ¡Cuidado!",
                `Has superado tu presupuesto. Gastado: $${totalGastos.toFixed(2)} / Límite: $${limitePresupuesto.toFixed(2)}`
            );
        }
        
    }, [estaExcedido]); 

    
    function alternarModal() {
        setTipoSeleccionado(undefined);
        setTransaccionAEditar(null);
        setOperacion("crear");
        setMostrarModal(!mostrarModal);
    }

    const confirmarEliminar = (id) => {
        Alert.alert(
            "Eliminar",
            "¿Borrar esta transacción?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Eliminar", 
                    style: "destructive", 
                    onPress: () => eliminarTransaccion(id) 
                }
            ]
        );
    };

    const editar = (item) => {
        setTransaccionAEditar(item); 
        setTipoSeleccionado(item.tipo);
        setOperacion("editar");
        setMostrarModal(true);
    };

    const etiquetaTipo = (t) =>
        t === "ingreso" ? "· Ingreso" : t === "gasto" ? "· Gasto" : "· Presupuesto";

    const tipos = [
        { label: "Gasto", value: "gasto" },
        { label: "Ingreso", value: "ingreso" },
        { label: "Presupuesto", value: "presupuesto" },
        { label: "Todo", value: "all" }, 
    ];

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
                            {tipos.map((t) => (
                                <TouchableOpacity 
                                    key={t.value}
                                    style={[
                                        styles.pildoraTipo, 
                                        activeFilter === t.value && styles.pildoraActiva
                                    ]}
                                    onPress={() => setActiveFilter(t.value)} 
                                >
                                    <Text 
                                        style={[
                                            styles.textoPildora, 
                                            activeFilter === t.value && styles.textoPildoraActiva
                                        ]}
                                    >
                                        {t.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        
                    </View>

                    
                    {transacciones.length === 0 ? (
                        <View style={{padding: 40, alignItems: 'center'}}>
                            <Feather name="list" size={40} color="#ccc" />
                            <Text style={{color: '#888', marginTop: 10}}>
                                {activeFilter === 'all' 
                                    ? 'No hay movimientos aún en este mes.' 
                                    : `No hay ${activeFilter}s en la lista para este mes.`}
                            </Text>
                            <Text style={{color: '#aaa', fontSize: 12}}>Usa el botón + para agregar uno.</Text>
                        </View>
                    ) : (
                        transacciones.map((item, idx) => (
                            <View key={item.id || idx} style={styles.fila}>
                                <View style={{flex: 1}}>
                                    <Text style={styles.tituloTransaccion}>
                                        {item.categoria} {etiquetaTipo(item.tipo)}
                                    </Text>
                                    
                                    {item.descripcion ? (
                                        <Text style={styles.descTransaccion} numberOfLines={1}>
                                            {item.descripcion}
                                        </Text>
                                    ) : null}

                                    
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
                                        {formatCurrency(item.monto)}
                                    </Text>

                                    <View style={styles.iconos}>
                                        <TouchableOpacity onPress={() => confirmarEliminar(item.id)} style={styles.toqueIcono}>
                                            <Feather name="trash-2" size={18} color="#0E7369" />
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => editar(item)} style={styles.toqueIcono}>
                                            <Feather name="edit-3" size={18} color="#0E7369" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>

            <Navbar toggleModal={alternarModal}/>
            
            <CrudModal
                visible={mostrarModal}
                setVisible={setMostrarModal}
                operation={operacion}
                type={tipoSeleccionado}
                itemEditar={transaccionAEditar} 
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
        marginTop: 0, 
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
    textoPildora: { 
        color: '#6B8B8B', 
        fontWeight: '600' 
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
    descTransaccion: { 
        color: "#666",
        fontSize: 12,
        fontStyle: "italic",
        marginBottom: 2
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