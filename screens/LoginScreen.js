import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';


export default function LoginScreen({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleLogin = () => {
    const usuarioLimpio = usuario.trim();
    const contrasenaLimpia = contrasena.trim();

    if (!usuarioLimpio && !contrasenaLimpia) {
      alert('Error: llene los campos');
    }
    else if (!usuarioLimpio && contrasenaLimpia) {
      alert('Error: te falta el usuario');
    }
    else if (usuarioLimpio && !contrasenaLimpia) {
      alert('Error: te falta tu contraseña');
    }
    else {

      console.log('Inicio de sesión simulado OK:', { usuarioLimpio, contrasenaLimpia });


      navigation.replace('Graph');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.backgroundMain} />

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="always"
        >

          <View style={styles.logoContainer}>

            <Image
              source={require('../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Inicio de Sesión</Text>
            <Text style={styles.label}>Usuario o Correo</Text>

            <TextInput
              style={styles.input}
              placeholder="Usuario"
              placeholderTextColor={COLORS.placeholderText}
              value={usuario}
              onChangeText={setUsuario}
              autoCapitalize="none"
            />
            <Text style={styles.label}>Contraseña</Text>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Contraseña"
                placeholderTextColor={COLORS.placeholderText}
                value={contrasena}
                onChangeText={setContrasena}
                secureTextEntry={true}
              />

              <Image
                source={require('../assets/ojo.png')}
                style={styles.eyeIconImage}
              />
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.recoverPasswordButton}>
              <Text style={styles.recoverPasswordText}>Recuperar Contraseña</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.recoverPasswordButton}
                onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.recoverPasswordText}>Registrarse</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

    </SafeAreaView>
  );
}


const COLORS = {
  backgroundMain: '#3B8A84',
  cardBackground: '#E0F2F1',
  primaryText: '#004D40',
  placeholderText: '#A0A0A0',
  white: '#FFFFFF',
};

const styles = StyleSheet.create({
  // ... el resto de tus estilos ...
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundMain,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  logoContainer: {
    marginBottom: 50,
    alignItems: 'center',
  },
  logoImage: {
    width: 180,
    height: 180,
  },
  eyeIconImage: {
    width: 24,
    height: 24,
    marginRight: 5,
  },
  card: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 20,
    padding: 25,
    paddingBottom: 35,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4, },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primaryText,
    textAlign: 'center',
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    color: COLORS.primaryText,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    borderColor: COLORS.cardBackground,
    borderWidth: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginBottom: 25,
    paddingHorizontal: 15,
    borderColor: COLORS.cardBackground,
    borderWidth: 1,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: COLORS.primaryText,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  recoverPasswordButton: {
    alignItems: 'center',
  },
  recoverPasswordText: {
    color: COLORS.primaryText,
    fontSize: 14,
    fontWeight: '600',
  },
});