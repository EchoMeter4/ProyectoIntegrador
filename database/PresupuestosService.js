import DatabaseService from './DatabaseService';
import Presupuesto from '../models/Presupuesto';

export default class PresupuestosService {
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

    async listarPorUsuario(userId) {
        const db = await this.ensureDB();
        const rows = await db.getAllAsync(
            'SELECT * FROM presupuestos WHERE id_usuario = ? ORDER BY year DESC, month DESC',
            [userId]
        );
        return rows.map(row => new Presupuesto(row));
    }

    async listarPorMes(userId, year, month) {
        const db = await this.ensureDB();
        const rows = await db.getAllAsync(
            'SELECT * FROM presupuestos WHERE id_usuario = ? AND year = ? AND month = ? ORDER BY categoria ASC',
            [userId, year, month]
        );
        return rows.map(row => new Presupuesto(row));
    }

    async agregar(presupuesto) {
        const db = await this.ensureDB();
        const model = new Presupuesto(presupuesto);
        const data = model.toPersistence();

        const result = await db.runAsync(
            `INSERT INTO presupuestos (id_usuario, categoria, monto, limite_notificacion, year, month)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [data.id_usuario, data.categoria, data.monto, data.limite_notificacion, data.year, data.month]
        );

        model.id = result.lastInsertRowId;
        return model;
    }

    async editar(id, presupuesto) {
        const db = await this.ensureDB();
        const model = new Presupuesto({ ...presupuesto, id });
        const data = model.toPersistence();

        await db.runAsync(
            `UPDATE presupuestos SET categoria = ?, monto = ?, limite_notificacion = ?, year = ?, month = ?
             WHERE id = ? AND id_usuario = ?`,
            [data.categoria, data.monto, data.limite_notificacion, data.year, data.month, id, data.id_usuario]
        );

        return model;
    }

    async eliminar(id, userId) {
        const db = await this.ensureDB();
        await db.runAsync('DELETE FROM presupuestos WHERE id = ? AND id_usuario = ?', [id, userId]);
    }
}

