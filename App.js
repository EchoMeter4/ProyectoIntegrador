import React from 'react';
import { AuthProvider } from "./components/AuthContext";
import { PreferencesProvider } from "./components/PreferencesContext";
import { TransactionsProvider } from "./components/TransactionsContext"; 
import RootNavigator from "./navigation/RootNavigator";

export default function App() {
    return (
        <AuthProvider>
            <PreferencesProvider>
                
                <TransactionsProvider>
                    <RootNavigator/>
                </TransactionsProvider>
            </PreferencesProvider>
        </AuthProvider>
    )
}