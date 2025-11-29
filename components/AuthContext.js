import {createContext, useContext, useEffect, useState} from "react";
import UsuariosController from "../controllers/UsuariosController";

const AuthContext = createContext(null);

const usuarioController = UsuariosController;

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const init = async () => {
            await usuarioController.initialize()
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

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}