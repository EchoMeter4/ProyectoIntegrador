import {createContext, useContext, useEffect, useState} from "react";
import UsuariosController from "../controllers/UsuariosController";
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const AuthContext = createContext(null);
const LAST_USER_KEY = 'last_logged_user_id'; 

const usuarioController = UsuariosController;

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const init = async () => {
            
            if (usuarioController.initialize) {
                await usuarioController.initialize();
            }
        };
        init();
    }, [])

    const login = async (usuario) => {
        const user = await usuarioController.auth(usuario);
        setUser(user);
        
        
        if (user && user.id) {
            await AsyncStorage.setItem(LAST_USER_KEY, user.id.toString());
        }
    }

    const logout = async () => { 
        setUser(null);
        
        await AsyncStorage.removeItem(LAST_USER_KEY); 
    }

    
    const recuperarPassword = async (identificador, nuevaPassword) => {
        if (usuarioController.recuperarPassword) {
            return await usuarioController.recuperarPassword(identificador, nuevaPassword);
        }
        console.log(`Solicitud de recuperación para: ${identificador}`);
        return true;
    }
    
    
    const getLastUserId = async () => {
        try {
            const userIdString = await AsyncStorage.getItem(LAST_USER_KEY);
            return userIdString ? parseInt(userIdString) : null;
        } catch (e) {
            console.error("Error al obtener el ID del último usuario:", e);
            return null;
        }
    }
    
    
    const userId = user ? user.id : null;

    return (
        
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            recuperarPassword,
            userId,
            getLastUserId 
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}