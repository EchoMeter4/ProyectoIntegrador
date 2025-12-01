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
    Image, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {useNavigation, StackActions} from "@react-navigation/native"; 
import {useAuth} from "../components/AuthContext";
import Usuario from "../models/Usuario";
import UsuariosController from "../controllers/UsuariosController";

const usuariosController = UsuariosController;

export default function App() {
    const navigation = useNavigation();

    const [usuario, setUsuario] = useState('');
    const [correo, setCorreo] = useState(''); 
    const [contrasena, setContrasena] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); 

    const {login} = useAuth();

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(prev => !prev);
    };

    const handleRegistro = async () => {
        try {
            const usuarioLimpio = usuario.trim();
            const correoLimpio = correo.trim();
            const contrasenaLimpia = contrasena.trim();

            if (!usuarioLimpio || !correoLimpio || !contrasenaLimpia) {
                Alert.alert('Error', 'Rellena todos los campos.');
                return;
            }

            const payload = {
                alias: usuarioLimpio,
                correo: correoLimpio,
                password: contrasenaLimpia,
            }
            const nuevoUsuario = new Usuario(payload);

            try {
                nuevoUsuario.validarTodo()
            } catch (error) {
                Alert.alert('Error', error.message);
                return;
            }

            const newUser = await usuariosController.crearUsuario(nuevoUsuario);
            
            await login(newUser);
            
        } catch (error) {
            console.error('Error RegisterScreen: ', error);
            Alert.alert('Error', 'Algo salió mal!');
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
                    <Text style={styles.title}>Bienvenido</Text>
                    <Text style={styles.subtitle}>Crea Tu Nuevo Usuario</Text>

                    <Text style={styles.label}>Nombre de Usuario</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre de Usuario"
                        placeholderTextColor={COLORS.placeholderText}
                        value={usuario}
                        onChangeText={setUsuario} 
                        autoCapitalize="none"
                    />

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

                    <TouchableOpacity style={styles.primaryButton} onPress={handleRegistro}>
                        <Text style={styles.primaryButtonText}>Crear Cuenta</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.secondaryButtonText}>Iniciar sesión</Text>
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
    
    eyeIconTouchable: { 
        padding: 5,
        marginLeft: 10,
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