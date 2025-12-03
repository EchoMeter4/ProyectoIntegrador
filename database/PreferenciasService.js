import DatabaseService from './DatabaseService';
import Preferencias from '../models/Preferencias';

export default class PreferenciasService {
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

    async obtenerPorUsuario(userId) {
        const db = await this.ensureDB();
        const row = await db.getFirstAsync(
            'SELECT * FROM preferencias_usuario WHERE id_usuario = ?',
            [userId]
        );
        if (!row) {
            return new Preferencias({ id_usuario: userId });
        }
        return new Preferencias({
            id_usuario: row.id_usuario,
            presupuesto: row.presupuesto,
            email_alert: Boolean(row.email_alert),
        });
    }

    async guardar(preferencias) {
        const db = await this.ensureDB();
        const prefs = new Preferencias(preferencias);
        const data = prefs.toPersistence();

        const existing = await db.getFirstAsync(
            'SELECT id FROM preferencias_usuario WHERE id_usuario = ?',
            [data.id_usuario]
        );

        if (existing) {
            await db.runAsync(
                'UPDATE preferencias_usuario SET presupuesto = ?, email_alert = ? WHERE id_usuario = ?',
                [data.presupuesto, data.email_alert, data.id_usuario]
            );
        } else {
            await db.runAsync(
                'INSERT INTO preferencias_usuario (id_usuario, presupuesto, email_alert) VALUES (?, ?, ?)',
                [data.id_usuario, data.presupuesto, data.email_alert]
            );
        }

        return new Preferencias({
            id_usuario: data.id_usuario,
            presupuesto: data.presupuesto,
            email_alert: Boolean(data.email_alert),
        });
    }
}
