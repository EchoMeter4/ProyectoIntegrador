import { useEffect, useState } from 'react';
import PreferenciasController from '../controllers/PreferenciasController';
import { useAuth } from '../components/AuthContext';

export default function usePreferencias() {
    const { userId } = useAuth();
    const [state, setState] = useState(PreferenciasController.getState());

    useEffect(() => {
        const listener = () => setState(PreferenciasController.getState());
        PreferenciasController.addListener(listener);
        PreferenciasController.setUser(userId);
        return () => PreferenciasController.removeListener(listener);
    }, [userId]);

    const setPresupuesto = (value) => {
        PreferenciasController.setPresupuestoLocal(value);
    };

    const setEmailAlert = (value) => {
        PreferenciasController.setEmailAlertLocal(value);
    };

    const savePreferences = async (nuevoPresupuesto, nuevaAlerta) => {
        await PreferenciasController.guardar({
            presupuesto: nuevoPresupuesto,
            email_alert: nuevaAlerta,
        });
        setState(PreferenciasController.getState());
    };

    return {
        ...state,
        setPresupuesto,
        setEmailAlert,
        savePreferences,
    };
}
