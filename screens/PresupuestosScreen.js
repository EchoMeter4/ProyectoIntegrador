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
        return presupuestos.filter((p) => `${p.year}-${String(p.month).padStart(2, '0')}` === filterMonthYear);
    }, [presupuestos, filterMonthYear]);

    const categoriasDisponibles = useMemo(() => {
        const set = new Set();
        currentBudgets.forEach((p) => set.add(p.categoria));
        return Array.from(set).sort();
    }, [currentBudgets]);

    const presupuestosFiltrados = useMemo(() => {
        return currentBudgets.filter((p) => (categoriaFiltro === 'all' ? true : p.categoria === categoriaFiltro));
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
        setEditingItem(item);
        setModalOperation(item ? 'editar' : 'crear');
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
        <View style={styles.page}>
            <ScrollView contentContainerStyle={styles.scrollArea}>
                <AppHeader />
                <View style={styles.cardSection}>
                    <View style={styles.headerRow}>
                        <Text style={styles.title}>Presupuestos ({filterMonthYear})</Text>
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
                                <Text style={[styles.chipText, categoriaFiltro === cat && styles.chipTextActiva]}>
                                    {cat === 'all' ? 'Todas' : cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {presupuestosFiltrados.length === 0 ? (
                        <Text style={styles.noBudgets}>No tienes presupuestos definidos para este mes.</Text>
                    ) : (
                        presupuestosFiltrados.map((presupuesto) => {
                            const gastado = gastosPorCategoria[presupuesto.categoria] || 0;
                            const progreso = gastado / presupuesto.monto;
                            const danger = progreso >= 1;
                            return (
                                <View key={presupuesto.id} style={styles.budgetCard}>
                                    <View style={styles.budgetHeader}>
                                        <View>
                                            <Text style={styles.category}>{presupuesto.categoria}</Text>
                                            <Text style={styles.amount}>{formatCurrency(gastado)} / {formatCurrency(presupuesto.monto)}</Text>
                                        </View>
                                        <View style={styles.actions}>
                                            <TouchableOpacity onPress={() => handleDelete(presupuesto.id)} style={styles.iconButton}>
                                                <Feather name="trash-2" size={18} color="#C0392B" />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => openModal(presupuesto)} style={styles.iconButton}>
                                                <Feather name="edit-3" size={18} color="#0F6D66" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <ProgressBar progress={Math.min(progreso, 1)} danger={danger} />
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

const BG = '#D2EFEC';

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: BG,
    },
    scrollArea: {
        paddingBottom: 80,
    },
    cardSection: {
        marginTop: -30,
        marginHorizontal: 16,
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 6,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F6D66',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0F6D66',
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
        paddingVertical: 6,
        marginBottom: 12,
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#C5D9D6',
        backgroundColor: '#F5FCFB',
        marginRight: 8,
    },
    chipActiva: {
        backgroundColor: '#0F6D66',
        borderColor: '#0F6D66',
    },
    chipText: {
        color: '#3A5858',
        fontWeight: '600',
    },
    chipTextActiva: {
        color: '#fff',
    },
    noBudgets: {
        color: '#78909C',
        textAlign: 'center',
        padding: 20,
    },
    budgetCard: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    budgetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    category: {
        fontSize: 16,
        fontWeight: '600',
        color: '#183236',
    },
    amount: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0F6D66',
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    iconButton: {
        padding: 6,
        borderRadius: 8,
        backgroundColor: 'rgba(15, 109, 102, 0.08)',
    },
});
