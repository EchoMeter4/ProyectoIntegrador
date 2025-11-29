import React, { createContext, useState, useContext } from 'react';


const PreferencesContext = createContext();


export function PreferencesProvider({ children }) {
 
  const [presupuesto, setPresupuesto] = useState('0');
  const [emailAlert, setEmailAlert] = useState(false);

 
  const savePreferences = (nuevoPresupuesto, nuevaAlerta) => {
    setPresupuesto(nuevoPresupuesto);
    setEmailAlert(nuevaAlerta);
  };

  return (
    <PreferencesContext.Provider 
      value={{ 
        presupuesto, 
        setPresupuesto, 
        emailAlert, 
        setEmailAlert,
        savePreferences 
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}


export function usePreferences() {
  return useContext(PreferencesContext);
}