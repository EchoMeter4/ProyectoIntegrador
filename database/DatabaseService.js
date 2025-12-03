import * as SQLite from 'expo-sqlite';
import env from '../env';

class DatabaseService {
    constructor() {
        this.db = null;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;
        try {
            this.initialized = true;
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
            this.initialized = false;
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
            console.log("Tablas creadas correctamente");
            if (env.debug_mode) {
                await this.seedData();
                console.log('Datos de prueba insertados en modo debug.');
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
            const result = await this.db.runAsync(`
                INSERT INTO
                    usuarios (alias, correo, password)
                VALUES
                    ('test', 'tester01@example.com', 'Test1234')
            `);
            const userId = result.lastInsertRowId;

            await this.db.runAsync(
                `INSERT INTO
                     preferencias_usuario (id_usuario, presupuesto, email_alert)
                 VALUES
                     (?, '5000', 0)`,
                [userId]
            );

            // Transacciones de los últimos 3 meses (realistas, 5 por mes máx.)
            await this.db.runAsync(
                `INSERT INTO
                     transacciones (id_usuario, monto, categoria, descripcion,
                                    fecha, tipo)
                 VALUES
                     -- Octubre 2025
                     (?, 2200.00, 'Salario', 'Pago mensual', '2025-10-01',
                      'ingreso'),
                     (?, 1200.50, 'Renta', 'Pago de renta', '2025-10-03',
                      'gasto'),
                     (?, 300.00, 'Comida', 'Super y despensa', '2025-10-05',
                      'gasto'),
                     (?, 100.00, 'Transporte', 'Gasolina', '2025-10-07',
                      'gasto'),
                     (?, 150.00, 'Entretenimiento', 'Salida al cine',
                      '2025-10-10', 'gasto'),

                     -- Noviembre 2025
                     (?, 2200.00, 'Salario', 'Pago mensual', '2025-11-01',
                      'ingreso'),
                     (?, 1200.50, 'Renta', 'Pago de renta', '2025-11-03',
                      'gasto'),
                     (?, 320.00, 'Comida', 'Super y despensa', '2025-11-05',
                      'gasto'),
                     (?, 600.00, 'Servicios', 'Luz, agua e internet',
                      '2025-11-07', 'gasto'),
                     (?, 150.00, 'Salud', 'Medicinas', '2025-11-10', 'gasto'),

                     -- Diciembre 2025
                     (?, 2200.00, 'Salario', 'Pago mensual', '2025-12-01',
                      'ingreso'),
                     (?, 1200.50, 'Renta', 'Pago de renta', '2025-12-03',
                      'gasto'),
                     (?, 350.00, 'Comida', 'Super y despensa', '2025-12-04',
                      'gasto'),
                     (?, 120.00, 'Transporte', 'Gasolina', '2025-12-05',
                      'gasto'),
                     (?, 200.00, 'Entretenimiento', 'Cena con amigos',
                      '2025-12-06', 'gasto')
                `,
                [
                    userId, userId, userId, userId, userId,
                    userId, userId, userId, userId, userId,
                    userId, userId, userId, userId, userId,
                ]
            );

            // Presupuestos mensuales para los mismos 3 meses
            await this.db.runAsync(
                `INSERT INTO
                     presupuestos (id_usuario, categoria, monto,
                                   limite_notificacion, year, month)
                 VALUES
                     -- Octubre 2025
                     (?, 'Comida', 400, 0, 2025, 10),
                     (?, 'Transporte', 200, 0, 2025, 10),
                     (?, 'Renta', 1300, 0, 2025, 10),
                     (?, 'Servicios', 700, 0, 2025, 10),
                     (?, 'Entretenimiento', 250, 0, 2025, 10),

                     -- Noviembre 2025
                     (?, 'Comida', 400, 0, 2025, 11),
                     (?, 'Transporte', 200, 0, 2025, 11),
                     (?, 'Renta', 1300, 0, 2025, 11),
                     (?, 'Servicios', 700, 0, 2025, 11),
                     (?, 'Salud', 200, 0, 2025, 11),

                     -- Diciembre 2025
                     (?, 'Comida', 450, 0, 2025, 12),
                     (?, 'Transporte', 220, 0, 2025, 12),
                     (?, 'Renta', 1300, 0, 2025, 12),
                     (?, 'Servicios', 720, 0, 2025, 12),
                     (?, 'Entretenimiento', 300, 0, 2025, 12)
                `,
                [
                    userId, userId, userId, userId, userId,
                    userId, userId, userId, userId, userId,
                    userId, userId, userId, userId, userId,
                ]
            );

            console.log('Datos de prueba insertados.');
        } else {
            console.log('Datos ya presentes, se omite seed.');
        }
    }
}

export default new DatabaseService();