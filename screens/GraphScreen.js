import React, {useMemo, useEffect, useState} from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import {PieChart} from "react-native-chart-kit";
import {
    VictoryChart,
    VictoryGroup,
    VictoryBar,
    VictoryAxis,
    VictoryLegend,
    VictoryLabel
} from 'victory-native';
import AppHeader from "../components/AppHeader";
import Navbar from '../components/Navbar';
import CrudModal from "./CrudModal";
import {useTransactionsBridge} from '../components/TransactionsBridge';
import {formatCurrency} from '../utils/utils';


const CHART_COLORS = ['#0F6D66', '#4DB6AC', '#80CBC4', '#B2DFDB', '#E0F2F1', '#26A69A', '#9E9E9E', '#E57373'];
const screenWidth = Dimensions.get("window").width;
const chartWidth = screenWidth - 80;
const pieWidth = screenWidth - 80;


const getShortMonthName = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString.substring(0, 4), dateString.substring(5, 7) - 1, 1);
    return date.toLocaleDateString('es-ES', {month: 'short'}).replace('.', '');
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

const generateMonthsEndingAt = (referenceMonth, count = 3) => {
    if (!referenceMonth) return [];
    const [year, month] = referenceMonth.split('-').map(Number);
    const baseDate = new Date(year, month - 1, 1);
    const months = [];
    for (let i = count - 1; i >= 0; i--) {
        const d = new Date(baseDate.getFullYear(), baseDate.getMonth() - i, 1);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        months.push(`${y}-${m}`);
    }
    return months;
};

const useCategoryExpenseData = (transactions) => {
    return useMemo(() => {
        const expenseTotals = {};
        let grandTotal = 0;
        transactions.forEach(tx => {
            if (tx.tipo === 'gasto' || tx.tipo === 'presupuesto') {
                const amount = Number(tx.monto) || 0;
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

const useCategoryIncomeData = (transactions) => {
    return useMemo(() => {
        const incomeTotals = {};
        let grandTotal = 0;
        transactions.forEach(tx => {
            if (tx.tipo === 'ingreso') {
                const amount = Number(tx.monto) || 0;
                grandTotal += amount;
                incomeTotals[tx.categoria] = (incomeTotals[tx.categoria] || 0) + amount;
            }
        });
        let colorIndex = 0;
        const chartData = Object.keys(incomeTotals).map((category) => {
            const amount = incomeTotals[category];
            const percentage = grandTotal > 0 ? ((amount / grandTotal) * 100).toFixed(0) : 0;
            const dataPoint = {
                name: category,
                population: amount,
                percentage,
                color: CHART_COLORS[colorIndex % CHART_COLORS.length],
                legendFontColor: '#333',
                legendFontSize: 14,
            };
            colorIndex++;
            return dataPoint;
        });
        return chartData.sort((a, b) => b.population - a.population);
    }, [transactions]);
};

export default function GraphScreen() {
    const [showModal, setShowModal] = useState(false);
    const toggleModal = () => setShowModal(!showModal);

    const {
        transacciones,
        getAllTransactionsForCharts,
        getTransactionsForMonth,
        filterMonthYear,
        lastUpdated
    } = useTransactionsBridge();

    const [currentMonthTransactions, setCurrentMonthTransactions] = useState(transacciones);
    const [monthlyComparison, setMonthlyComparison] = useState({
        labels: [],
        datasets: []
    });
    const [loadingMonthly, setLoadingMonthly] = useState(true);

    useEffect(() => {
        const fetchCurrentMonth = async () => {
            const monthData = await getTransactionsForMonth(filterMonthYear);
            setCurrentMonthTransactions(monthData);
        };
        fetchCurrentMonth();
    }, [filterMonthYear, getTransactionsForMonth, lastUpdated]);

    useEffect(() => {
        const loadMonthlyWindow = async () => {
            setLoadingMonthly(true);
            const months = generateMonthsEndingAt(filterMonthYear, 3);
            if (months.length === 0) {
                setMonthlyComparison({labels: [], datasets: []});
                setLoadingMonthly(false);
                return;
            }
            const monthBatches = await Promise.all(
                months.map((month) => getTransactionsForMonth(month))
            );
            const incomeData = [];
            const expenseData = [];
            monthBatches.forEach(batch => {
                let ingresos = 0;
                let gastos = 0;
                batch.forEach(tx => {
                    const amount = Number(tx.monto) || 0;
                    if (tx.tipo === 'ingreso') {
                        ingresos += amount;
                    } else if (tx.tipo === 'gasto') {
                        gastos += amount;
                    }
                });
                incomeData.push(ingresos);
                expenseData.push(gastos);
            });
            setMonthlyComparison({
                labels: months.map(getShortMonthName),
                datasets: [
                    {
                        data: incomeData,
                        color: (opacity = 1) => `rgba(0, 179, 148, ${opacity})`,
                        label: 'Ingreso'
                    },
                    {
                        data: expenseData,
                        color: (opacity = 1) => `rgba(0, 77, 64, ${opacity})`,
                        label: 'Gasto'
                    },
                ],
            });
            setLoadingMonthly(false);
        };
        loadMonthlyWindow();
    }, [filterMonthYear, getTransactionsForMonth, lastUpdated]);

    const pieChartData = useCategoryExpenseData(currentMonthTransactions);
    const hasCurrentMonthData = currentMonthTransactions.length > 0 && pieChartData.length > 0;

    const incomePieData = useCategoryIncomeData(currentMonthTransactions);
    const hasIncomeData = currentMonthTransactions.length > 0 && incomePieData.length > 0;

    const incomeSummary = useMemo(() => {
        return transacciones
            .filter(t => t.tipo === 'ingreso')
            .reduce((acc, tx) => {
                const amount = parseFloat(tx.monto) || 0;
                acc[tx.categoria] = (acc[tx.categoria] || 0) + amount;
                return acc;
            }, {});
    }, [transacciones]);

    const incomeEntries = Object.entries(incomeSummary);

    const [currentYear, currentMonth] = filterMonthYear.split('-');
    const currentMonthFormatted = new Date(currentYear, currentMonth - 1).toLocaleDateString('es-ES', {
        month: 'long',
        year: 'numeric'
    });

    const chartConfig = {
        backgroundGradientFrom: '#fff',
        backgroundGradientTo: '#fff',
        color: (opacity = 1) => `rgba(0, 77, 64, ${opacity})`,
        barPercentage: 0.6,
        decimalPlaces: 0,
    };

    if (loadingMonthly) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0F6D66"/>
                <Text style={styles.loadingText}>Cargando datos
                                                 históricos...</Text>
            </View>
        );
    }

    return (
        <View style={styles.page}>
            <ScrollView contentContainerStyle={styles.scrollArea}>
                <AppHeader/>

                <View style={styles.cardSection}>

                    <View style={[styles.card, styles.chartCard]}>
                        <Text style={styles.cardTitle}>Gastos e Ingresos
                                                       Mensuales</Text>
                        {monthlyComparison.labels.length > 0 ? (
                            <View style={styles.chartWrapper}>
                                <VictoryChart
                                    domainPadding={{x: 36, y: 20}}
                                    height={250}
                                    width={chartWidth}
                                    padding={{
                                        top: 50,
                                        bottom: 40,
                                        left: 20,
                                        right: 20
                                    }}
                                >
                                    <VictoryAxis
                                        tickValues={monthlyComparison.labels}
                                        style={{
                                            axis: {stroke: '#D0E4E1'},
                                            tickLabels: {
                                                fontSize: 12,
                                                fill: '#2F4F4F'
                                            },
                                            grid: {stroke: 'transparent'},
                                        }}
                                    />
                                    <VictoryAxis
                                        dependentAxis
                                        tickFormat={() => ''}
                                        style={{
                                            axis: {stroke: 'transparent'},
                                            tickLabels: {fill: 'transparent'},
                                            grid: {
                                                stroke: '#E6F2F0',
                                                strokeDasharray: '4,4'
                                            },
                                        }}
                                    />
                                    <VictoryLegend
                                        x={(chartWidth / 2) - 100}
                                        y={0}
                                        orientation="horizontal"
                                        gutter={20}
                                        style={{
                                            labels: {
                                                fontSize: 12,
                                                fill: '#2F4F4F'
                                            }
                                        }}
                                        data={[
                                            {
                                                name: 'Ingreso',
                                                symbol: {
                                                    fill: '#00B394',
                                                    type: 'square'
                                                }
                                            },
                                            {
                                                name: 'Gasto',
                                                symbol: {
                                                    fill: '#004D40',
                                                    type: 'square'
                                                }
                                            },
                                        ]}
                                    />
                                    <VictoryGroup offset={26}>
                                        <VictoryBar
                                            data={monthlyComparison.datasets[0].data.map((value, idx) => ({
                                                x: monthlyComparison.labels[idx],
                                                y: value
                                            }))}
                                            labels={({datum}) => formatCurrency(datum.y)}
                                            style={{
                                                data: {
                                                    fill: '#00B394',
                                                    width: 22
                                                },
                                                labels: {
                                                    fill: '#14564C',
                                                    fontSize: 10,
                                                    fontWeight: '600'
                                                }
                                            }}
                                            cornerRadius={{top: 3, bottom: 0}}
                                            labelComponent={<VictoryLabel
                                                dy={-8}
                                            />}
                                        />
                                        <VictoryBar
                                            data={monthlyComparison.datasets[1].data.map((value, idx) => ({
                                                x: monthlyComparison.labels[idx],
                                                y: value
                                            }))}
                                            labels={({datum}) => formatCurrency(datum.y)}
                                            style={{
                                                data: {
                                                    fill: '#004D40',
                                                    width: 22
                                                },
                                                labels: {
                                                    fill: '#062B27',
                                                    fontSize: 10,
                                                    fontWeight: '600'
                                                }
                                            }}
                                            cornerRadius={{top: 3, bottom: 0}}
                                            labelComponent={<VictoryLabel
                                                dy={-8}
                                            />}
                                        />
                                    </VictoryGroup>
                                </VictoryChart>
                            </View>
                        ) : (
                            <Text style={styles.noDataText}>No hay suficientes
                                                            datos en los últimos
                                                            3 meses.</Text>
                        )}
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Gastos por Categoría
                                                       ({currentMonthFormatted})</Text>
                        {hasCurrentMonthData ? (
                            <PieChart
                                data={pieChartData}
                                width={pieWidth}
                                height={200}
                                chartConfig={chartConfig}
                                accessor={'population'}
                                backgroundColor={'transparent'}
                                paddingLeft={'0'}
                                center={[(screenWidth / 2) - 120, 0]}
                                hasLegend={false}
                                absolute={false}
                                style={styles.chart}
                            />
                        ) : (
                            <Text style={styles.noDataText}>No hay datos de
                                                            gastos en el mes
                                                            activo.</Text>
                        )}
                        <Text style={styles.sectionTitle}>Categorías</Text>
                        {pieChartData.map((data) => (
                            <View key={data.name} style={styles.row}>
                                <View
                                    style={[styles.circle, {backgroundColor: data.color}]}
                                />
                                <Text style={styles.name}>{data.name}</Text>
                                <View style={styles.rightContainer}>
                                    <Text
                                        style={styles.money}
                                    >{formatCurrency(data.population)}</Text>
                                    <Text style={styles.note}>{data.percentage}%
                                                                               del
                                                                               total</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Ingresos por Categoría
                                                       ({currentMonthFormatted})</Text>
                        {hasIncomeData ? (
                            <PieChart
                                data={incomePieData}
                                width={pieWidth}
                                height={200}
                                chartConfig={chartConfig}
                                accessor={'population'}
                                backgroundColor={'transparent'}
                                paddingLeft={'0'}
                                center={[(screenWidth / 2) - 120, 0]}
                                hasLegend={false}
                                absolute={false}
                                style={styles.chart}
                            />
                        ) : (
                            <Text style={styles.noDataText}>No hay ingresos
                                                            registrados en este
                                                            mes.</Text>
                        )}
                        <Text style={styles.sectionTitle}>Categorías</Text>
                        {incomePieData.map((data) => (
                            <View key={data.name} style={styles.row}>
                                <View
                                    style={[styles.circle, {backgroundColor: data.color}]}
                                />
                                <Text style={styles.name}>{data.name}</Text>
                                <View style={styles.rightContainer}>
                                    <Text
                                        style={styles.money}
                                    >{formatCurrency(data.population)}</Text>
                                    <Text style={styles.note}>{data.percentage}%
                                                                               del
                                                                               total</Text>
                                </View>
                            </View>
                        ))}
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
    chartCard: {
        paddingBottom: 12,
    },
    chartWrapper: {
        width: '100%',
        alignItems: 'center',
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