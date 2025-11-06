import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TextInput, TouchableOpacity, Alert } from 'react-native';

export default function NotificationScreen() {
  const [emailAlert, setEmailAlert] = useState(false);
  const [presupuesto, setPresupuesto] = useState('0');

  const guardarConfiguracion = () => {
    if (!emailAlert && (!presupuesto || presupuesto === '0')) {
      Alert.alert('Configuración incompleta', 'Activa las alertas o establece un presupuesto válido.');
      return;
    }
    Alert.alert(
      'Configuración guardada',
      `Notificaciones por correo: ${emailAlert ? 'Activadas' : 'Desactivadas'}\n Presupuesto máximo: $${presupuesto}`
    );
  };

  return (
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
        />
        <Text style={styles.subtext}>
          Recibirás un correo si superas tu límite mensual
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={guardarConfiguracion}>
        <Text style={styles.buttonText}>GUARDAR CONFIGURACIÓN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#58b5a6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
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