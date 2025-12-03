import React from 'react';
import { AuthProvider } from "./components/AuthContext";
import { PreferencesProvider } from "./components/PreferencesContext";
import { TransactionsBridgeProvider } from "./components/TransactionsBridge";
import { PresupuestosProvider } from "./components/PresupuestosContext";
import RootNavigator from "./navigation/RootNavigator";

export default function App() {
    return (
        <AuthProvider>
            <PreferencesProvider>
                <TransactionsBridgeProvider>
                    <PresupuestosProvider>
                        <RootNavigator/>
                    </PresupuestosProvider>
                </TransactionsBridgeProvider>
            </PreferencesProvider>
        </AuthProvider>
    )
}