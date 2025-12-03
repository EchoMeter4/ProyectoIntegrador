import { createContext, useContext } from 'react';
import useTransacciones from '../hooks/useTransacciones';

const TransactionsBridgeContext = createContext(null);

export function TransactionsBridgeProvider({ children }) {
    const value = useTransacciones();
    return (
        <TransactionsBridgeContext.Provider value={value}>
            {children}
        </TransactionsBridgeContext.Provider>
    );
}

export function useTransactionsBridge() {
    const context = useContext(TransactionsBridgeContext);
    if (!context) {
        throw new Error('useTransactionsBridge debe usarse dentro de TransactionsBridgeProvider');
    }
    return context;
}
