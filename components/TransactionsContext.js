import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import DatabaseService from '../database/DatabaseService';

const TransactionsContext = createContext();

export function TransactionsProvider({ children }) {
  const [transacciones, setTransacciones] = useState([]);
  
  
  const [activeFilter, setActiveFilter] = useState('all'); 

  
  const initialMonthYear = new Date().toISOString().substring(0, 7); 
  const [filterMonthYear, setFilterMonthYear] = useState(initialMonthYear);


  
  useEffect(() => {
    const init = async () => {
      try {
        if (!DatabaseService.getDB()) {
            await DatabaseService.initialize();
        }
        
        await recargarTransacciones(activeFilter, filterMonthYear);
      } catch (error) {
        console.error("Error al cargar transacciones:", error);
      }
    };
    init();
   
  }, [activeFilter, filterMonthYear]); 

  
  
  const recargarTransacciones = async (tipo, mesAnio) => {
    try {
      const db = DatabaseService.getDB();
      if (!db) return;
      
      let sql = 'SELECT * FROM transacciones WHERE 1=1'; 
      let params = [];
        
      
      if (mesAnio) {
          
          sql += ' AND fecha LIKE ?';
          params.push(`${mesAnio}%`); 
      }
      
      
      if (tipo && tipo !== 'all') {
          sql += ' AND tipo = ?';
          params.push(tipo);
      }
      
      sql += ' ORDER BY id DESC';
        
      
      const result = await db.getAllAsync(sql, params);
      setTransacciones(result);
    } catch (error) {
      console.error("Error leyendo datos:", error);
    }
  };


  
  const getAllTransactionsForCharts = async () => {
      const db = DatabaseService.getDB();
      if (!db) return [];

      try {
          
          let sql = 'SELECT * FROM transacciones ORDER BY fecha ASC'; 
          
          const result = await db.getAllAsync(sql, []);
          return result;
      } catch (error) {
          console.error("Error obteniendo data para gráficos:", error);
          return [];
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
      
      await recargarTransacciones(activeFilter, filterMonthYear); 
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
      
      await recargarTransacciones(activeFilter, filterMonthYear);
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  
  
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
      
      await recargarTransacciones(activeFilter, filterMonthYear);
    } catch (error) {
      console.error("Error al editar:", error);
      throw error;
    }
  };


  return (
    <TransactionsContext.Provider value={{ 
      transacciones, 
      
      
      activeFilter, 
      setActiveFilter, 

      
      filterMonthYear, 
      setFilterMonthYear,
      
      
      getAllTransactionsForCharts,
      
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