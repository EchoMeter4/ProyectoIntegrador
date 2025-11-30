import * as SQLite from 'expo-sqlite';

class DatabaseService {
    constructor() {
        this.db = null;
    }

    async initialize() {
        try {
            
            this.db = await SQLite.openDatabaseAsync('mi_app_finanzas_v1.db');
            
            
            await this.db.runAsync('PRAGMA journal_mode = WAL;');
            await this.db.runAsync('PRAGMA foreign_keys = ON;');

            await this.createTables();
            console.log("Base de datos maestra inicializada correctamente");
        } catch (error) {
            console.error("Error crítico al inicializar la BD:", error);
        }
    }

    async createTables() {
        try {
            
            await this.db.runAsync(`
                CREATE TABLE IF NOT EXISTS usuarios (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    alias VARCHAR(50) NOT NULL UNIQUE,
                    correo VARCHAR(100) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL
                );
            `);

            
            await this.db.runAsync(`
                CREATE TABLE IF NOT EXISTS transacciones (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    id_usuario INTEGER NOT NULL,  
                    monto TEXT NOT NULL,
                    categoria TEXT NOT NULL,
                    descripcion TEXT,
                    fecha TEXT,
                    tipo TEXT,
                    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)  
                );
            `);

            
            await this.db.runAsync(`
                CREATE TABLE IF NOT EXISTS presupuestos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    id_usuario INTEGER NOT NULL,
                    nombre VARCHAR(50) NOT NULL,
                    icono VARCHAR(64) NOT NULL,
                    color_hex CHAR(7) NOT NULL,
                    limite_notificacion DECIMAL(18, 2) NOT NULL,
                    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
                );
            `);
            
            console.log("Tablas creadas correctamente");
        } catch (error) {
            console.error("Error creando tablas:", error);
        }
    }
    
    
    getDB() {
        return this.db;
    }
}

export default new DatabaseService();