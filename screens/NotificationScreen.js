import React, { useState, useEffect } from 'react'; 
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  SafeAreaView,
  StatusBar,
  TouchableWithoutFeedback, 
  Keyboard 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';


import { usePreferences } from "../components/PreferencesContext";

export default function NotificationScreen({ navigation }) {
  
  const { 
    emailAlert, 
    setEmailAlert, 
    presupuesto, 
    setPresupuesto,
    savePreferences 
  } = usePreferences();

  

  const guardarConfiguracion = () => {
    
    if (!emailAlert && (!presupuesto || presupuesto === '0' || presupuesto === '')) {
      Alert.alert('Configuración incompleta', 'Activa las alertas o establece un presupuesto válido.');
      return;
    }
    
    Keyboard.dismiss();

    
    
    Alert.alert(
      'Configuración guardada',
      `Notificaciones: ${emailAlert ? 'ON' : 'OFF'}\nPresupuesto Global: $${presupuesto}`,
      [
        { text: "OK", onPress: () => navigation.goBack() } 
      ]
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#58b5a6" />
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
             <Ionicons name="arrow-back" size={30} color="#043c3d" />
          </TouchableOpacity>
        </View>

        <View style={styles.container}>
          <Text style={styles.title}>Notificaciones automáticas</Text>

          <View style={styles.section}>
            <Text style={styles.label}>Activar alertas por correo</Text>
            <Switch
              value={emailAlert}
              onValueChange={setEmailAlert} 
              trackColor={{ false: '#ccc', true: '#006d6d' }}
              thumbColor={emailAlert ? '#00c2b2' : '#f4f3f4'}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Presupuesto mensual máximo ($)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={presupuesto}
              onChangeText={setPresupuesto} 
              placeholder="0.00"
              placeholderTextColor="#5a8585"
            />
            <Text style={styles.subtext}>
              Recibirás un correo si superas tu límite mensual
            </Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={guardarConfiguracion}>
            <Text style={styles.buttonText}>GUARDAR CONFIGURACIÓN</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#58b5a6',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: 'flex-start',
  },
  backButton: {
    padding: 5,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
    marginTop: -40,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#043c3d',
    marginBottom: 40,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    backgroundColor: '#8ed1c4',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#a8dcd2',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003232',
    marginBottom: 10,
  },
  input: {
    width: '80%',
    backgroundColor: '#70b9ac',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 28,
    color: '#003232',
    fontWeight: 'bold',
    paddingVertical: 8,
  },
  subtext: {
    color: '#4b6868',
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#004d4b',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#e8f7f4',
    fontWeight: 'bold',
    fontSize: 16,
  },
});