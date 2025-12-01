import React, { useState, useEffect } from 'react';
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
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication'; 
import { getBiometricPreference } from '../utils/BiometricStorage'; 
import UsuariosController from "../controllers/UsuariosController"; 
import {useAuth} from "../components/AuthContext";
import Usuario from "../models/Usuario";
import {isValidEmail} from "../utils/utils";

const usuariosController = UsuariosController; 

export default function LoginScreen({ navigation }) {
    const [campoUsuario, setcampoUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    
    
    const [canAuthenticate, setCanAuthenticate] = useState(false); 
    const [lastUserId, setLastUserId] = useState(null); 
    
    const {login, getLastUserId} = useAuth(); 

    
    
    useEffect(() => {
        const checkBiometrics = async () => {
            const lastId = await getLastUserId();
            setLastUserId(lastId);

            if (lastId) {
                
                const isBiometryEnabled = await LocalAuthentication.isEnrolledAsync();
                
                const isUserPreferenceSaved = await getBiometricPreference(lastId);

                if (isBiometryEnabled && isUserPreferenceSaved) {
                    setCanAuthenticate(true);
                }
            }
        };
        checkBiometrics();
    }, []);


    const togglePasswordVisibility = () => {
        setIsPasswordVisible(prev => !prev);
    };

    const handleLogin = async () => {
        const usuarioLimpio = campoUsuario.trim();
        const contrasenaLimpia = contrasena.trim();

        if (!usuarioLimpio || !contrasenaLimpia) {
            Alert.alert('Error', 'Rellene todos los campos.');
            return;
        }
        if (!usuarioLimpio) {
            Alert.alert('Error', 'Te falta el usuario.');
            return;
        }
        if (!contrasenaLimpia) {
            Alert.alert('Error', 'Te falta tu contraseña.');
            return;
        }

        const usuario = new Usuario({password: contrasenaLimpia});
        if (isValidEmail(usuarioLimpio)) {
            usuario.correo = campoUsuario;
        } else {
            usuario.alias = campoUsuario
        }

        try {
            await login(usuario);
        } catch (error) {
            Alert.alert('Error de Autenticación', error.message);
        }
    };

    
    const handleBiometricLogin = async () => {
        if (!lastUserId) {
            Alert.alert('Error', 'Debe iniciar sesión al menos una vez para activar la biometría.');
            return;
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Inicia sesión con tu huella o rostro.',
        });

        if (result.success) {
            
            
            try {
                
                const userObject = await usuariosController.loginById(lastUserId); 
                await login(userObject); 
            } catch (error) {
                 Alert.alert('Error', 'Fallo al cargar el perfil de usuario.');
            }

        } else if (result.error === 'user_fallback' || result.error === 'user_cancel') {
             
             Alert.alert('Acción requerida', 'Introduce tu contraseña para continuar.');
        } else {
             Alert.alert('Fallo', 'Autenticación biométrica fallida. Inténtalo de nuevo.');
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
                        value={campoUsuario}
                        onChangeText={setcampoUsuario}
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
                            secureTextEntry={!isPasswordVisible}
                        />
                        <TouchableOpacity
                            onPress={togglePasswordVisibility}
                            style={styles.eyeIconTouchable}
                        >
                            <Ionicons
                                name={isPasswordVisible ? 'eye-off' : 'eye'}
                                size={24}
                                color={COLORS.placeholderText}
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleLogin}
                    >
                        <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                    </TouchableOpacity>
                    
                    
                    {canAuthenticate && (
                        <TouchableOpacity
                            style={[styles.loginButton, styles.biometricButton]}
                            onPress={handleBiometricLogin}
                        >
                            <Ionicons name="finger-print" size={24} color={COLORS.white} />
                            <Text style={styles.biometricButtonText}> Acceso Biométrico</Text>
                        </TouchableOpacity>
                    )}


                    <TouchableOpacity 
                        style={styles.recoverPasswordButton}
                        onPress={() => navigation.navigate('Recovery')}
                    >
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
    eyeIconTouchable: {
        padding: 5,
        marginLeft: 10, 
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
    
    biometricButton: {
        backgroundColor: '#18794e', 
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25, 
    },
    biometricButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    recoverPasswordButton: {
        alignItems: 'center',
        marginTop: 15,
    },
    recoverPasswordText: {
        color: COLORS.primaryText,
        fontSize: 14,
        fontWeight: '600',
    },
});