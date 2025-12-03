import React, { createContext, useContext } from 'react';
import usePreferencias from '../hooks/usePreferencias';


const PreferencesContext = createContext();


export function PreferencesProvider({ children }) {
  const value = usePreferencias();

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}


export function usePreferences() {
  return useContext(PreferencesContext);
}