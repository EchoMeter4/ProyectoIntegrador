import React, { useState, useEffect } from 'react';

import * as LocalAuthentication from 'expo-local-authentication';

import ChangePasswordModal from '../components/ChangePasswordModal';

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



import { getBiometricPreference, saveBiometricPreference, removeBiometricPreference } from '../utils/BiometricStorage';



export default function ProfileScreen() {

    const navigation = useNavigation();

    const {logout, user} = useAuth();

   

   

    const userId = user?.id;



    const [showPasswordModal, setShowPasswordModal] = useState(false);

   

    const [biometricsEnabled, setBiometricsEnabled] = useState(false);



   

    useEffect(() => {

        const checkStatus = async () => {

            if (userId) {

                const isEnabled = await getBiometricPreference(userId);

                setBiometricsEnabled(isEnabled);

            }

        };

        checkStatus();

    }, [userId]);



    const handleBiometricSetup = async () => {

        if (!userId) return Alert.alert('Error', 'Debe iniciar sesión para configurar la biometría.');

       

       

        if (biometricsEnabled) {

            Alert.alert('Desactivar Biometría', '¿Estás seguro de que quieres desactivar el inicio de sesión biométrico?', [

                { text: 'Cancelar', style: 'cancel' },

                { text: 'Sí, Desactivar', onPress: async () => {

                    await removeBiometricPreference(userId);

                    setBiometricsEnabled(false);

                    Alert.alert('Éxito', 'Biometría desactivada.');

                }, style: 'destructive' },

            ]);

            return;

        }



       

        const hasHardware = await LocalAuthentication.hasHardwareAsync();

        const isEnrolled = await LocalAuthentication.isEnrolledAsync();



        if (!hasHardware || !isEnrolled) {

            return Alert.alert("Advertencia", "Tu dispositivo no tiene sensor biométrico o no has registrado huellas/rostros en los ajustes del teléfono.");

        }



        const result = await LocalAuthentication.authenticateAsync({

            promptMessage: 'Confirma tu identidad para activar el inicio de sesión rápido.',

            disableDeviceFallback: true,

        });



        if (result.success) {

            await saveBiometricPreference(userId);

            setBiometricsEnabled(true);

            Alert.alert('Éxito', '¡Autenticación biométrica activada!');

        } else if (result.error === 'user_fallback' || result.error === 'user_cancel') {

             Alert.alert('Activación cancelada', 'Puedes intentarlo de nuevo.');

        } else {

             Alert.alert('Fallo', 'No se pudo confirmar tu identidad.');

        }

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



                <TouchableOpacity

                    style={styles.option}

                    onPress={() => setShowPasswordModal(true)}

                >

                    <Text style={styles.optionText}>Cambiar Contraseña</Text>

                    <Ionicons name="lock-closed-outline" size={22} color="#2B7A78" />

                </TouchableOpacity>



               

                {/*<TouchableOpacity*/}

                {/*    style={styles.option}*/}

                {/*    onPress={handleBiometricSetup}*/}

                {/*>*/}

                {/*    <Text style={styles.optionText}>Autenticación Biométrica</Text>*/}

                {/*   */}

                {/*    <Ionicons*/}

                {/*        name={biometricsEnabled ? "checkmark-circle" : "finger-print-outline"}*/}

                {/*        size={22}*/}

                {/*        color={biometricsEnabled ? "#004D40" : "#2B7A78"}*/}

                {/*    />*/}

                {/*</TouchableOpacity>*/}

            </View>



            <View style={styles.section}>

                <Text style={styles.sectionTitle}>Preferencias</Text>



                {/*<TouchableOpacity*/}

                {/*    style={styles.option}*/}

                {/*    onPress={() => navigation.navigate('Notifications')}*/}

                {/*>*/}

                {/*    <Text style={styles.optionText}>Notificaciones</Text>*/}

                {/*    <Ionicons name="notifications-outline" size={22} color="#2B7A78" />*/}

                {/*</TouchableOpacity>*/}

            </View>



            <TouchableOpacity style={styles.logoutButton} onPress={() => handleLogout()}>

                <Text style={styles.logoutText}>Cerrar Sesión</Text>

            </TouchableOpacity>

           

            {showPasswordModal && (

                <ChangePasswordModal

                    visible={showPasswordModal}

                    onClose={() => setShowPasswordModal(false)}

                />

            )}

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