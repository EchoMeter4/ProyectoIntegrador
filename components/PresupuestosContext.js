import React, { createContext, useContext } from 'react';
import usePresupuestos from '../hooks/usePresupuestos';

const PresupuestosContext = createContext();

export function PresupuestosProvider({ children }) {
    const value = usePresupuestos();
    return (
        <PresupuestosContext.Provider value={value}>
            {children}
        </PresupuestosContext.Provider>
    );
}

export function usePresupuestosBridge() {
    const context = useContext(PresupuestosContext);
    if (!context) {
        throw new Error('usePresupuestosBridge debe usarse dentro de PresupuestosProvider');
    }
    return context;
}

