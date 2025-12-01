import AsyncStorage from '@react-native-async-storage/async-storage';

const BIOMETRIC_KEY_PREFIX = 'biometric_user_';


export const saveBiometricPreference = async (userId) => {
    try {
        await AsyncStorage.setItem(BIOMETRIC_KEY_PREFIX + userId, 'true');
        return true;
    } catch (e) {
        console.error("Error guardando preferencia biométrica:", e);
        return false;
    }
};


export const getBiometricPreference = async (userId) => {
    try {
        const value = await AsyncStorage.getItem(BIOMETRIC_KEY_PREFIX + userId);
        return value === 'true'; 
    } catch (e) {
        console.error("Error leyendo preferencia biométrica:", e);
        return false;
    }
};


export const removeBiometricPreference = async (userId) => {
    try {
        await AsyncStorage.removeItem(BIOMETRIC_KEY_PREFIX + userId);
        return true;
    } catch (e) {
        console.error("Error eliminando preferencia biométrica:", e);
        return false;
    }
};