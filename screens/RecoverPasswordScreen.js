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


export default function RecoverPasswordScreen() {
  const [correo, setCorreo] = useState('');

  const handleRecuperar = () => {
    const correoLimpio = correo.trim();

    if (!correoLimpio) {
      alert('Error: Escribe tu correo electrónico');
      return;
    }
    if (!correoLimpio.includes('@')) {
      alert('Error: el correo debe contener "@"');
      return;
    }
    if (!correoLimpio.includes('.com')) {
      alert('Error: el correo debe contener ".com"');
      return;
    }
    
    alert('Éxito: Se ha enviado un correo de recuperación a ' + correoLimpio);
    console.log('Recuperación simulada OK:', { correoLimpio });
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
            <Text style={styles.title}>Recuperar Contraseña</Text>
            <Text style={styles.subtitle}>Ingresa tu correo electrónico</Text>

            <Text style={styles.label}>Correo Electronico</Text>
            <TextInput
              style={styles.input}
              placeholder="Correo Electrónico"
              placeholderTextColor={COLORS.placeholderText}
              value={correo}
              onChangeText={setCorreo} 
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TouchableOpacity style={styles.primaryButton} onPress={handleRecuperar}>
              <Text style={styles.primaryButtonText}>Enviar Correo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Volver a Iniciar sesión</Text>
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
    fontSize: 28, 
    fontWeight: 'bold',
    color: COLORS.primaryText,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
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
    marginBottom: 25,
    borderColor: COLORS.cardBackground, 
    borderWidth: 1,
  },
  primaryButton: {
    backgroundColor: COLORS.primaryText,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.primaryText,
    fontSize: 14,
    fontWeight: '600',
  },
});