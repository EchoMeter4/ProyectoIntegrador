import React, { useMemo, useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { PieChart, BarChart } from "react-native-chart-kit";
import AppHeader from "../components/AppHeader";
import Navbar from '../components/Navbar';
import CrudModal from "./CrudModal";
import { useTransactionsBridge } from '../components/TransactionsBridge';


const CHART_COLORS = ['#0F6D66', '#4DB6AC', '#80CBC4', '#B2DFDB', '#E0F2F1', '#26A69A', '#9E9E9E', '#E57373'];
const screenWidth = Dimensions.get("window").width;


const getShortMonthName = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString.substring(0, 4), dateString.substring(5, 7) - 1, 1);
    return date.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '');
};

const generateLastNMonths = (n) => {
    let months = [];
    let date = new Date();
    for (let i = 0; i < n; i++) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        months.unshift(`${year}-${month}`); 
        date.setMonth(date.getMonth() - 1); 
    }
    return months;
};

const useCategoryExpenseData = (transactions) => {
    return useMemo(() => {
        const expenseTotals = {};
        let grandTotal = 0;
        
        transactions.forEach(tx => {
            if (tx.tipo === 'gasto' || tx.tipo === 'presupuesto') {
                const amount = parseFloat(tx.monto) || 0; 
                grandTotal += amount;
                expenseTotals[tx.categoria] = (expenseTotals[tx.categoria] || 0) + amount;
            }
        });

        let colorIndex = 0;
        const chartData = Object.keys(expenseTotals).map((category) => {
            const amount = expenseTotals[category];
            const percentage = grandTotal > 0 ? ((amount / grandTotal) * 100).toFixed(0) : 0;
            
            const dataPoint = {
                name: category,
                population: amount, 
                percentage: percentage, 
                color: CHART_COLORS[colorIndex % CHART_COLORS.length], 
                legendFontColor: '#333',
                legendFontSize: 14
            };
            colorIndex++;
            return dataPoint;
        });

        return chartData.sort((a, b) => b.population - a.population);
    }, [transactions]);
};


const useMonthlyComparisonData = (getAllTransactionsForCharts) => {
    const [monthlyData, setMonthlyData] = useState({ labels: [], datasets: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const processData = async () => {
            setLoading(true);
            
            const allTransactions = await getAllTransactionsForCharts(); 
            
            const totalsByMonth = {};
            const monthsToShow = 3; 

            allTransactions.forEach(tx => {
                const monthKey = tx.fecha.substring(0, 7); 
                const amount = parseFloat(tx.monto) || 0;

                if (!totalsByMonth[monthKey]) {
                    totalsByMonth[monthKey] = { ingreso: 0, gasto: 0 };
                }

                if (tx.tipo === 'ingreso') {
                    totalsByMonth[monthKey].ingreso += amount;
                } else if (tx.tipo === 'gasto' || tx.tipo === 'presupuesto') {
                    totalsByMonth[monthKey].gasto += amount;
                }
            });
            
            const calendarMonths = generateLastNMonths(monthsToShow); 
            
            const labels = calendarMonths.map(getShortMonthName);
            const incomeData = calendarMonths.map(month => totalsByMonth[month]?.ingreso || 0);
            const expenseData = calendarMonths.map(month => totalsByMonth[month]?.gasto || 0);

            setMonthlyData({
                labels: labels,
                datasets: [
                    { data: incomeData, color: (opacity = 1) => `rgba(0, 179, 148, ${opacity})`, label: "Ingreso" },
                    { data: expenseData, color: (opacity = 1) => `rgba(0, 77, 64, ${opacity})`, label: "Gasto" }
                ]
            });
            setLoading(false);
        };
        processData();
    }, [getAllTransactionsForCharts]);

    return { monthlyData, loading };
};


export default function GraphScreen() {
    const [showModal, setShowModal] = useState(false);
    const toggleModal = () => setShowModal(!showModal);

    
    const { transacciones, getAllTransactionsForCharts, filterMonthYear } = useTransactionsBridge();

    const pieChartData = useCategoryExpenseData(transacciones);
    const hasCurrentMonthData = transacciones.length > 0 && pieChartData.length > 0;
    
    const { monthlyData, loading: loadingMonthly } = useMonthlyComparisonData(getAllTransactionsForCharts);
    const hasMonthlyData = monthlyData.labels && monthlyData.labels.length > 0;
    
    const [currentYear, currentMonth] = filterMonthYear.split('-');
    const currentMonthFormatted = new Date(currentYear, currentMonth - 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    
    const chartConfig = {
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        color: (opacity = 1) => `rgba(0, 77, 64, ${opacity})`, 
        barPercentage: 0.6,
        decimalPlaces: 0, 
    };
    
    if (loadingMonthly) {
          return (
              <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#0F6D66" />
                  <Text style={styles.loadingText}>Cargando datos históricos...</Text>
              </View>
          );
    }
    

    return (
        <View style={styles.page}>
            <ScrollView contentContainerStyle={styles.scrollArea}>
                <AppHeader/>
                
                <View style={styles.cardSection}>
                    
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Gastos e Ingresos Mensuales</Text>
                        
                        {hasMonthlyData ? (
                            <BarChart
                                data={monthlyData}
                                width={screenWidth - 40} 
                                height={250}
                                chartConfig={chartConfig}
                                verticalLabelRotation={-20}
                                showBarTops={false}
                                fromZero={true}
                                style={styles.chart}
                            />
                        ) : (
                            <Text style={styles.noDataText}>No hay suficientes datos en los últimos 3 meses.</Text>
                        )}
                        
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Gastos por Categoría ({currentMonthFormatted})</Text>
                        
                        {hasCurrentMonthData ? (
                            <PieChart
                                data={pieChartData}
                                width={screenWidth - 40} 
                                height={200}
                                chartConfig={chartConfig}
                                accessor={"population"} 
                                backgroundColor={"transparent"}
                                paddingLeft={"15"}
                                center={[8, 0]} 
                                absolute 
                                style={styles.chart}
                            />
                        ) : (
                            <Text style={styles.noDataText}>No hay datos de gastos en el mes activo.</Text>
                        )}
                        
                        
                        <Text style={styles.sectionTitle}>Categorías</Text>
                        
                        {pieChartData.map((data, index) => (
                            <View key={data.name} style={styles.row}>
                                <View style={[styles.circle, { backgroundColor: data.color }]}/>
                                <Text style={styles.name}>{data.name}</Text>
                                <View style={styles.rightContainer}>
                                    <Text style={styles.money}>${data.population.toFixed(2)}</Text>
                                    <Text style={styles.note}>{data.percentage}% del total</Text> 
                                </View>
                            </View>
                        ))}
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Ingresos</Text>
                        
                        <Text style={styles.sectionTitle}>Totales de Ingreso ({currentMonthFormatted})</Text>
                        
                        
                        {
                            Object.entries(
                                transacciones
                                .filter(t => t.tipo === 'ingreso')
                                .reduce((acc, tx) => {
                                    acc[tx.categoria] = (acc[tx.categoria] || 0) + (parseFloat(tx.monto) || 0);
                                    return acc;
                                }, {})
                            ).map(([category, amount], idx) => (
                                <View key={category} style={styles.row}>
                                    <View style={[styles.circle, { backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }]}/>
                                    <Text style={styles.name}>{category}</Text>
                                    <Text style={styles.money}>${amount.toFixed(2)}</Text>
                                </View>
                            ))
                        }
                        
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
        backgroundColor: BG,
    },
    loadingText: {
        color: '#0F6D66',
        marginTop: 10,
        fontSize: 16,
    },
    noDataText: {
        color: '#888', 
        marginTop: 10,
        padding: 20,
        textAlign: 'center',
    },
    chart: {
        borderRadius: 12,
        alignSelf: 'center',
    },
    page: {
        flex: 1,
        backgroundColor: BG
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
    card: {
        backgroundColor: "white",
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 20,
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
        marginBottom: 10,
        paddingHorizontal: 20,
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
        marginVertical: 8,
        paddingHorizontal: 20,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
        paddingHorizontal: 20,
    },
    circle: {
        width: 12,
        height: 12,
        borderRadius: 6,
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