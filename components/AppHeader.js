import {Alert, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {MaterialIcons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";


import { useTransactions } from "./TransactionsContext"; 


const formatMonthYear = (isoDate) => {
    if (!isoDate) return 'Cargando...';
    const [year, month] = isoDate.split('-');
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
};

const changeMonth = (currentMonthYear, direction) => {
    const [year, month] = currentMonthYear.split('-').map(Number);
    let newDate = new Date(year, month - 1 + direction, 1);
    
    const newYear = newDate.getFullYear();
    const newMonth = String(newDate.getMonth() + 1).padStart(2, '0');
    return `${newYear}-${newMonth}`;
};



export default function AppHeader() {
    const navigation = useNavigation();
    
    
    const { 
        filterMonthYear, 
        setFilterMonthYear 
    } = useTransactions();

    
    const handleMonthNavigation = (direction) => {
        const newMonthYear = changeMonth(filterMonthYear, direction);
        setFilterMonthYear(newMonthYear); 
    };

    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Resumen</Text>
            
            
            <View style={styles.monthContainer}>
                
                
                <TouchableOpacity onPress={() => handleMonthNavigation(-1)} style={styles.monthArrow}>
                    <Text style={styles.arrowText}>&lt;</Text>
                </TouchableOpacity>

                
                <Text style={styles.headerSubtitle}>
                    {formatMonthYear(filterMonthYear)}
                </Text>

                
                <TouchableOpacity onPress={() => handleMonthNavigation(1)} style={styles.monthArrow}>
                    <Text style={styles.arrowText}>&gt;</Text>
                </TouchableOpacity>
            </View>
            
            <TouchableOpacity
                onPress={() => navigation.navigate('Profile')}
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
        fontWeight: "bold", 
        color: "white"
    },
    
    monthContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    headerSubtitle: { 
        color: "white",
        fontSize: 15,
        fontWeight: '500',
        marginHorizontal: 5,
    },
    monthArrow: {
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    arrowText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    iconConfig: {
        position: 'absolute',
        right: 30,
        top: 70,
    },
})