import * as SQLite from 'expo-sqlite';

class DatabaseService {
    constructor() {
        this.db = null;
    }

    async initialize() {
        this.db = await SQLite.openDatabaseAsync('app.db');
        await this.createTables();
    }

    async createTables() {
        await this.db.runAsync(`PRAGMA foreign_keys = ON`);

        await this.db.runAsync(
            `CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            alias VARCHAR(50)  NOT NULL,
            correo  VARCHAR(100) NOT NULL,
            password VARCHAR(255) NOT NULL
        )`);

        await this.db.runAsync(
            `CREATE TABLE IF NOT EXISTS presupuestos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_usuario INTEGER NOT NULL,
            nombre VARCHAR(50) NOT NULL,
            icono VARCHAR(64) NOT NULL,
            color_hex CHAR(7) NOT NULL,
            limite_notificacion DECIMAL(18, 2) NOT NULL,
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
        )`);

        await this.db.runAsync(
            `CREATE TABLE IF NOT EXISTS transacciones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_usuario INTEGER NOT NULL,
            id_categoria INTEGER NOT NULL,
            monto DECIMAL(18, 2) NOT NULL,
            nota VARCHAR(255),
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
            FOREIGN KEY (id_categoria) REFERENCES presupuestos(id)
        )`);

        await this.db.runAsync(
            `CREATE TABLE IF NOT EXISTS ingresos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_usuario INTEGER NOT NULL,
            monto DECIMAL(18, 2) NOT NULL,
            nota VARCHAR(255),
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
        )`);

        await this.db.runAsync(
            `CREATE TABLE IF NOT EXISTS notificaciones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_usuario INTEGER NOT NULL,
            monto_maximo INTEGER NOT NULL,
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
        )`);
    }
}

export default new DatabaseService();