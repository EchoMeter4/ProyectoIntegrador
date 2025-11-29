import React from 'react';
import { AuthProvider } from "./components/AuthContext";

import { PreferencesProvider } from "./components/PreferencesContext";
import RootNavigator from "./navigation/RootNavigator";

export default function App() {
    return (
        <AuthProvider>
            <PreferencesProvider>
                <RootNavigator/>
            </PreferencesProvider>
        </AuthProvider>
    )
}