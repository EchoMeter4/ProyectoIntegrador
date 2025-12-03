import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import Navbar from '../components/Navbar';
import CrudModal from './CrudModal';
import ProgressBar from '../components/ProgressBar';
import { usePresupuestosBridge } from '../components/PresupuestosContext';
import { useTransactionsBridge } from '../components/TransactionsBridge';
import { formatCurrency } from '../utils/utils';

const VERDE = '#0F6D66';
const FONDO = '#D2EFEC';
const BORDE = '#E6ECEC';

export default function PresupuestosScreen() {
    const [showModal, setShowModal] = useState(false);
    const [modalOperation, setModalOperation] = useState('crear');
    const [editingItem, setEditingItem] = useState(null);
    const [categoriaFiltro, setCategoriaFiltro] = useState('all');

    const { presupuestos, eliminarPresupuesto, refreshPresupuestos } = usePresupuestosBridge();
    const { transacciones, filterMonthYear, lastUpdated } = useTransactionsBridge();

    useEffect(() => {
        refreshPresupuestos();
    }, [lastUpdated]);

    const currentBudgets = useMemo(() => {
        return presupuestos.filter(
            (p) => `${p.year}-${String(p.month).padStart(2, '0')}` === filterMonthYear
        );
    }, [presupuestos, filterMonthYear]);

    const categoriasDisponibles = useMemo(() => {
        const set = new Set();
        currentBudgets.forEach((p) => set.add(p.categoria));
        return Array.from(set).sort();
    }, [currentBudgets]);

    const presupuestosFiltrados = useMemo(() => {
        return currentBudgets.filter((p) =>
            categoriaFiltro === 'all' ? true : p.categoria === categoriaFiltro
        );
    }, [currentBudgets, categoriaFiltro]);

    const gastosPorCategoria = useMemo(() => {
        return transacciones
            .filter((tx) => tx.tipo === 'gasto')
            .reduce((acc, tx) => {
                acc[tx.categoria] = (acc[tx.categoria] || 0) + (Number(tx.monto) || 0);
                return acc;
            }, {});
    }, [transacciones]);

    const openModal = (item = null) => {
        if (item) {
            const monthValue = String(item.month).padStart(2, '0');
            setEditingItem({
                ...item,
                tipo: 'presupuesto',
                fecha: `${item.year}-${monthValue}-01`,
            });
            setModalOperation('editar');
        } else {
            setEditingItem(null);
            setModalOperation('crear');
        }
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);

    const handleDelete = (id) => {
        Alert.alert('Eliminar presupuesto', '¿Deseas eliminar este presupuesto?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                    await eliminarPresupuesto(id);
                    await refreshPresupuestos();
                },
            },
        ]);
    };

    return (
        <View style={styles.pagina}>
            <ScrollView contentContainerStyle={styles.areaScroll} showsVerticalScrollIndicator={false}>
                <AppHeader />

                <View style={styles.tarjetaLista}>
                    <View style={styles.encabezadoLista}>
                        <View style={styles.tituloFila}>
                            <Text style={styles.sectionTitle}>Presupuestos ({filterMonthYear})</Text>
                        </View>
                        <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
                            <Feather name="plus" size={18} color="#fff" />
                            <Text style={styles.addButtonText}>Nuevo</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoriasChips}
                    >
                        {['all', ...categoriasDisponibles].map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                style={[styles.chip, categoriaFiltro === cat && styles.chipActiva]}
                                onPress={() => setCategoriaFiltro(cat)}
                            >
                                <Text
                                    style={[
                                        styles.chipText,
                                        categoriaFiltro === cat && styles.chipTextActiva,
                                    ]}
                                >
                                    {cat === 'all' ? 'Todas' : cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {presupuestosFiltrados.length === 0 ? (
                        <View style={styles.noBudgetsWrapper}>
                            <Feather name="target" size={40} color="#ccc" />
                            <Text style={styles.noBudgetsMain}>
                                No tienes presupuestos definidos para este mes.
                            </Text>
                            <Text style={styles.noBudgetsSub}>
                                Usa el botón "Nuevo" para agregar uno.
                            </Text>
                        </View>
                    ) : (
                        presupuestosFiltrados.map((presupuesto, idx) => {
                            const gastado = gastosPorCategoria[presupuesto.categoria] || 0;
                            const progreso = gastado / presupuesto.monto;
                            const danger = progreso >= 1;

                            return (
                                <View
                                    key={presupuesto.id || idx}
                                    style={[
                                        styles.filaPresupuesto,
                                        idx === 0 && styles.filaPrimera,
                                    ]}
                                >
                                    <View style={styles.budgetInfo}>
                                        <Text style={styles.category}>
                                            {presupuesto.categoria}
                                        </Text>
                                        <Text style={styles.amount}>
                                            {formatCurrency(gastado)} /{' '}
                                            {formatCurrency(presupuesto.monto)}
                                        </Text>
                                    </View>

                                    <View style={styles.budgetRight}>
                                        <View style={styles.actions}>
                                            <TouchableOpacity
                                                onPress={() => handleDelete(presupuesto.id)}
                                                style={styles.toqueIcono}
                                            >
                                                <Feather
                                                    name="trash-2"
                                                    size={18}
                                                    color="#C0392B"
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => openModal(presupuesto)}
                                                style={styles.toqueIcono}
                                            >
                                                <Feather
                                                    name="edit-3"
                                                    size={18}
                                                    color={VERDE}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={styles.progressWrapper}>
                                        <ProgressBar
                                            progress={Math.min(progreso, 1)}
                                            danger={danger}
                                        />
                                    </View>
                                </View>
                            );
                        })
                    )}
                </View>
            </ScrollView>

            <Navbar toggleModal={() => openModal()} currentRoute="Presupuestos" />
            <CrudModal
                visible={showModal}
                setVisible={closeModal}
                operation={modalOperation}
                type="presupuesto"
                itemEditar={editingItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    pagina: {
        flex: 1,
        backgroundColor: FONDO,
    },
    areaScroll: {
        paddingBottom: 110,
    },
    tarjetaLista: {
        backgroundColor: '#fff',
        marginTop: -20,
        marginHorizontal: 16,
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    encabezadoLista: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    tituloFila: {
        flexShrink: 1,
        paddingRight: 8,
    },
    sectionTitle: {
        color: VERDE,
        fontWeight: '700',
        fontSize: 16,
        marginLeft: 4,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: VERDE,
        borderRadius: 12,
        paddingVertical: 6,
        paddingHorizontal: 12,
        gap: 6,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    categoriasChips: {
        flexDirection: 'row',
        paddingVertical: 4,
        marginBottom: 6,
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: BORDE,
        backgroundColor: '#F4FBFB',
        marginRight: 8,
    },
    chipActiva: {
        backgroundColor: VERDE,
        borderColor: VERDE,
    },
    chipText: {
        color: '#395657',
        fontWeight: '600',
    },
    chipTextActiva: {
        color: '#fff',
    },
    noBudgetsWrapper: {
        padding: 40,
        alignItems: 'center',
    },
    noBudgetsMain: {
        color: '#888',
        marginTop: 10,
        textAlign: 'center',
    },
    noBudgetsSub: {
        color: '#aaa',
        fontSize: 12,
        marginTop: 4,
        textAlign: 'center',
    },
    filaPresupuesto: {
        borderTopWidth: 1,
        borderColor: BORDE,
        paddingVertical: 12,
    },
    filaPrimera: {
        borderTopWidth: 0,
    },
    budgetInfo: {
        marginBottom: 6,
    },
    category: {
        fontSize: 15,
        fontWeight: '700',
        color: VERDE,
    },
    amount: {
        fontSize: 13,
        fontWeight: '600',
        color: '#0F6D66',
    },
    budgetRight: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    actions: {
        flexDirection: 'row',
        gap: 10,
    },
    toqueIcono: {
        padding: 6,
        borderRadius: 8,
    },
    progressWrapper: {
        marginTop: 8,
    },
});