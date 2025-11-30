import React, { createContext, useContext, useState, useEffect } from 'react';
import DatabaseService from '../database/DatabaseService';

const TransactionsContext = createContext();

export function TransactionsProvider({ children }) {
  const [transacciones, setTransacciones] = useState([]);

  
  useEffect(() => {
    const init = async () => {
      try {
        
        if (!DatabaseService.getDB()) {
            await DatabaseService.initialize();
        }
        await recargarTransacciones();
      } catch (error) {
        console.error("Error al cargar transacciones:", error);
      }
    };
    init();
  }, []);

  
  const recargarTransacciones = async () => {
    try {
      const db = DatabaseService.getDB();
      if (!db) return;
      
      const result = await db.getAllAsync('SELECT * FROM transacciones ORDER BY id DESC');
      setTransacciones(result);
    } catch (error) {
      console.error("Error leyendo datos:", error);
    }
  };

  
  const agregarTransaccion = async (tx) => {
    const db = DatabaseService.getDB();
    if (!db) throw new Error("Base de datos no lista");

    try {
      await db.runAsync(
        'INSERT INTO transacciones (monto, categoria, descripcion, fecha, tipo) VALUES (?, ?, ?, ?, ?)',
        [
          tx.monto, 
          tx.categoria, 
          tx.descripcion || '', 
          tx.fecha, 
          tx.tipo
        ]
      );
      await recargarTransacciones(); 
    } catch (error) {
      console.error("Error al agregar:", error);
      throw error; 
    }
  };

  
  const eliminarTransaccion = async (id) => {
    const db = DatabaseService.getDB();
    if (!db) return;

    try {
      await db.runAsync('DELETE FROM transacciones WHERE id = ?', [id]);
      await recargarTransacciones();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  // EDITAR: Corregido el paso de parámetros con [ ]
  const editarTransaccion = async (id, tx) => {
    const db = DatabaseService.getDB();
    if (!db) return;

    try {
      await db.runAsync(
        'UPDATE transacciones SET monto = ?, categoria = ?, descripcion = ?, fecha = ?, tipo = ? WHERE id = ?',
        [
          tx.monto, 
          tx.categoria, 
          tx.descripcion || '', 
          tx.fecha, 
          tx.tipo, 
          id
        ]
      );
      await recargarTransacciones();
    } catch (error) {
      console.error("Error al editar:", error);
      throw error;
    }
  };

  return (
    <TransactionsContext.Provider value={{ 
      transacciones, 
      agregarTransaccion, 
      eliminarTransaccion, 
      editarTransaccion 
    }}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error("useTransactions debe usarse dentro de un TransactionsProvider");
  }
  return context;
}