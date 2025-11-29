import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {useNavigation} from "@react-navigation/native";
import {useAuth} from "../components/AuthContext";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const {logout, user} = useAuth();

  const handlePress = (option) => {
    Alert.alert('Opción seleccionada', `Has presionado: ${option}`);
  };

  function handleLogout() {
    logout()
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backIcon}
        >
          <Ionicons name="arrow-back" size={24} color="white"/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ajustes</Text>
        <View style={styles.avatar}>
          <Ionicons name="person" size={60} color="#2B7A78" />
        </View>
        <Text style={styles.userName}> {user?.alias || "Usuario"} </Text>
        <Text style={styles.userEmail}>{user?.correo || "correo@ejemplo.com"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Seguridad</Text>

        <TouchableOpacity style={styles.option} onPress={() => handlePress('Cambiar Contraseña')}>
          <Text style={styles.optionText}>Cambiar Contraseña</Text>
          <Ionicons name="lock-closed-outline" size={22} color="#2B7A78" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => handlePress('Autenticación Biométrica')}>
          <Text style={styles.optionText}>Autenticación Biométrica</Text>
          <Ionicons name="finger-print-outline" size={22} color="#2B7A78" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferencias</Text>

        
        <TouchableOpacity 
            style={styles.option} 
            onPress={() => navigation.navigate('Notifications')}
        >
          <Text style={styles.optionText}>Notificaciones</Text>
          <Ionicons name="notifications-outline" size={22} color="#2B7A78" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={() => handleLogout()}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FFFF',
  },
  header: {
    backgroundColor: '#2B7A78',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30,
    paddingTop: 60,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  backIcon: {
    position: 'absolute',
    top: 60,
    left: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    marginTop: 10,
    fontWeight: 'bold',
  },
  avatar: {
    backgroundColor: '#E0F2F1',
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  userEmail: {
    color: 'white',
    textDecorationLine: 'underline',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#004D40',
    marginBottom: 10,
  },
  option: {
    backgroundColor: '#A7E4E4',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 15,
    color: '#004D40',
  },
  logoutButton: {
    backgroundColor: '#A7E4E4',
    margin: 30,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    color: '#004D40',
    fontWeight: 'bold',
  },
});