import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from './AuthContext'; 

import UserControllerInstance from '../controllers/UsuariosController'; 

export default function ChangePasswordModal({ visible, onClose }) {
    const { userId, logout } = useAuth();
    
    
    
    const [currentPasswordInput, setCurrentPasswordInput] = useState('');
    const [newPasswordInput, setNewPasswordInput] = useState('');
    const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePasswordChange = async () => {
        
        const currentPassword = (currentPasswordInput || '').trim();
        const newPassword = (newPasswordInput || '').trim();
        const confirmPassword = (confirmPasswordInput || '').trim();
        
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Todos los campos son obligatorios.');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'La nueva contraseña y su confirmación no coinciden.');
            return;
        }

        if (currentPassword === newPassword) {
            Alert.alert('Error', 'La nueva contraseña debe ser diferente a la actual.');
            return;
        }
        
        if (!userId) {
            Alert.alert('Error', 'Sesión no válida.');
            return;
        }

        setLoading(true);
        try {
            
            
            await UserControllerInstance.updatePassword(userId, currentPassword, newPassword);

            Alert.alert('Éxito', 'Tu contraseña ha sido actualizada. Por seguridad, debes iniciar sesión de nuevo.');
            
            setCurrentPasswordInput('');
            setNewPasswordInput('');
            setConfirmPasswordInput('');
            onClose();
            
            logout(); 

        } catch (error) {
            
            
            console.warn('Error controlado al actualizar contraseña:', error.message); 
            
            Alert.alert('Error al actualizar', error.message || 'Error desconocido.');
            
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView behavior="padding" style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Cambiar Contraseña</Text>
                    
                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña Actual"
                        secureTextEntry={true}
                        value={currentPasswordInput}
                        onChangeText={text => setCurrentPasswordInput(text)} 
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Nueva Contraseña"
                        secureTextEntry={true}
                        value={newPasswordInput}
                        onChangeText={text => setNewPasswordInput(text)}
                    />
                    
                    <TextInput
                        style={styles.input}
                        placeholder="Confirmar Nueva Contraseña"
                        secureTextEntry={true}
                        value={confirmPasswordInput}
                        onChangeText={text => setConfirmPasswordInput(text)}
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={[styles.button, styles.buttonClose]} 
                            onPress={onClose}
                            disabled={loading}
                        >
                            <Text style={styles.textStyle}>Cancelar</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[styles.button, styles.buttonSave]}
                            onPress={handlePasswordChange}
                            disabled={loading}
                        >
                            <Text style={styles.textStyle}>
                                {loading ? <ActivityIndicator color="white" /> : 'Guardar Cambios'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "stretch",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
        maxWidth: 400,
    },
    modalTitle: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 20,
        fontWeight: 'bold',
        color: '#004D40',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
        backgroundColor: '#f9f9f9',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        borderRadius: 10,
        padding: 12,
        elevation: 2,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    buttonClose: {
        backgroundColor: '#A7E4E4',
    },
    buttonSave: {
        backgroundColor: '#004D40',
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    }
});