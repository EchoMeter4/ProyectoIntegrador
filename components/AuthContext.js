import {createContext, useContext, useEffect, useState} from "react";
import UsuariosController from "../controllers/UsuariosController";

const AuthContext = createContext(null);

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
    }

    const logout = () => {
        setUser(null);
    }

    
    const recuperarPassword = async (email) => {
        
        if (usuarioController.recuperarPassword) {
            return await usuarioController.recuperarPassword(email);
        }
        
        
        console.log(`Solicitud de recuperación para: ${email}`);
        
        
        return true; 
    }
    
    
    const userId = user ? user.id : null;

    return (
        
        <AuthContext.Provider value={{user, login, logout, recuperarPassword, userId}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}