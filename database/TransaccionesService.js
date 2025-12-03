import DatabaseService from './DatabaseService';
import Transaccion from '../models/Transaccion';
import { formatCurrency } from '../utils/utils';

export default class TransaccionesService {
    constructor() {
        this.dbService = DatabaseService;
    }

    async initialize() {
        if (!this.dbService.getDB()) {
            await this.dbService.initialize();
        }
    }

    async ensureDB() {
        if (!this.dbService.getDB()) {
            await this.initialize();
        }
        return this.dbService.getDB();
    }

    async listarPorUsuario({ userId, tipo, mesAnio }) {
        const db = await this.ensureDB();
        let sql = 'SELECT * FROM transacciones WHERE id_usuario = ?';
        const params = [userId];

        if (mesAnio) {
            sql += ' AND fecha LIKE ?';
            params.push(`${mesAnio}%`);
        }
        if (tipo && tipo !== 'all') {
            sql += ' AND tipo = ?';
            params.push(tipo);
        }

        sql += ' ORDER BY id DESC';
        const filas = await db.getAllAsync(sql, params);
        return filas.map(row => new Transaccion({ ...row, monto: Number(row.monto) }));
    }

    async obtenerTodasParaGraficas(userId) {
        const db = await this.ensureDB();
        const filas = await db.getAllAsync(
            'SELECT * FROM transacciones WHERE id_usuario = ? ORDER BY fecha ASC',
            [userId]
        );
        return filas.map(row => new Transaccion({ ...row, monto: Number(row.monto) }));
    }

    async agregar(transaccion) {
        const db = await this.ensureDB();
        const tx = new Transaccion(transaccion);
        const data = tx.prepararParaPersistencia();

        const result = await db.runAsync(
            'INSERT INTO transacciones (id_usuario, monto, categoria, descripcion, fecha, tipo) VALUES (?, ?, ?, ?, ?, ?)',
            [
                data.id_usuario,
                data.monto,
                data.categoria,
                data.descripcion,
                data.fecha,
                data.tipo,
            ]
        );

        tx.id = result.lastInsertRowId;
        return tx;
    }

    async editar(id, transaccion) {
        const db = await this.ensureDB();
        const tx = new Transaccion({ ...transaccion, id });
        const data = tx.prepararParaPersistencia();

        await db.runAsync(
            'UPDATE transacciones SET monto = ?, categoria = ?, descripcion = ?, fecha = ?, tipo = ? WHERE id = ? AND id_usuario = ?',
            [
                data.monto,
                data.categoria,
                data.descripcion,
                data.fecha,
                data.tipo,
                id,
                data.id_usuario,
            ]
        );

        return tx;
    }

    async eliminar(id, userId) {
        const db = await this.ensureDB();
        await db.runAsync('DELETE FROM transacciones WHERE id = ? AND id_usuario = ?', [id, userId]);
    }
}
