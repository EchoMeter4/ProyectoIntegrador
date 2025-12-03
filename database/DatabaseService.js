import * as SQLite from 'expo-sqlite';
import env from '../env';

class DatabaseService {
    constructor() {
        this.db = null;
    }

    async initialize() {
        try {
            
            if (env.debug_mode) {
                await SQLite.deleteDatabaseAsync('mi_app_finanzas_v1.db');
                console.log('Base de datos eliminada (debug).');
            }
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
            
            if (env.debug_mode) {
                await this.db.runAsync('DROP TABLE IF EXISTS presupuestos');
                await this.db.runAsync('DROP TABLE IF EXISTS preferencias_usuario');
                await this.db.runAsync('DROP TABLE IF EXISTS transacciones');
                await this.db.runAsync('DROP TABLE IF EXISTS usuarios');
            }
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
                    monto DECIMAL(18, 2) NOT NULL,
                    categoria TEXT NOT NULL,
                    descripcion TEXT,
                    fecha TEXT,
                    tipo TEXT,
                    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)  
                );
            `);

            await this.db.runAsync(`
                CREATE TABLE IF NOT EXISTS preferencias_usuario (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    id_usuario INTEGER NOT NULL UNIQUE,
                    presupuesto TEXT DEFAULT '0',
                    email_alert INTEGER DEFAULT 0,
                    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
                );
            `);

            await this.db.runAsync(`
                CREATE TABLE IF NOT EXISTS presupuestos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    id_usuario INTEGER NOT NULL,
                    categoria TEXT NOT NULL,
                    monto DECIMAL(18, 2) NOT NULL,
                    limite_notificacion DECIMAL(18, 2) NOT NULL,
                    year SMALLINT NOT NULL,
                    month TINYINT NOT NULL,
                    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
                );
            `);

            const presupuestoColumns = await this.db.getAllAsync(`PRAGMA table_info('presupuestos')`);
            const hasCategoria = presupuestoColumns.some(col => col.name === 'categoria');
            const hasMonto = presupuestoColumns.some(col => col.name === 'monto');
            if (!hasCategoria) {
                await this.db.runAsync(`ALTER TABLE presupuestos ADD COLUMN categoria TEXT NOT NULL DEFAULT ''`);
            }
            if (!hasMonto) {
                await this.db.runAsync(`ALTER TABLE presupuestos ADD COLUMN monto DECIMAL(18, 2) NOT NULL DEFAULT 0`);
            }

            console.log("Tablas creadas correctamente");
            if (env.debug_mode) {
                await this.seedData();
            }
        } catch (error) {
            console.error("Error creando tablas:", error);
        }
    }
    
    
    getDB() {
        return this.db;
    }

    async seedData() {
        const user = await this.db.getFirstAsync('SELECT id FROM usuarios LIMIT 1');
        if (!user || env.debug_mode) {
            const result = await this.db.runAsync(`INSERT INTO usuarios (alias, correo, password) VALUES ('tester', 'tester01@example.com', 'Test1234')`);
            const userId = result.lastInsertRowId;
            await this.db.runAsync(`INSERT INTO preferencias_usuario (id_usuario, presupuesto, email_alert) VALUES (?, '5000', 0)`, [userId]);
            await this.db.runAsync(`INSERT INTO transacciones (id_usuario, monto, categoria, descripcion, fecha, tipo) VALUES
                (?, 1200.50, 'Renta', 'Pago de renta', '2025-01-05', 'gasto'),
                (?, 300.00, 'Comida', 'Despensa', '2025-01-06', 'gasto'),
                (?, 2200.00, 'Salario', 'Pago mensual', '2025-01-01', 'ingreso')
            `, [userId, userId, userId]);
            await this.db.runAsync(`INSERT INTO presupuestos (id_usuario, categoria, monto, limite_notificacion, year, month) VALUES
                (?, 'Comida', 400, 0, 2025, 1),
                (?, 'Transporte', 200, 0, 2025, 1)
            `, [userId, userId]);
            console.log('Datos de prueba insertados.');
        } else {
            console.log('Datos ya presentes, se omite seed.');
        }
    }
}

export default new DatabaseService();