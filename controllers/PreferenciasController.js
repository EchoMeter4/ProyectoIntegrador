import BaseController from './BaseController';
import PreferenciasService from '../database/PreferenciasService';

class PreferenciasController extends BaseController {
    constructor() {
        super();
        this.service = new PreferenciasService();
        this.state = {
            presupuesto: '0',
            emailAlert: false,
        };
        this.userId = null;
    }

    async initialize() {
        await this.service.initialize();
    }

    getState() {
        return this.state;
    }

    async setUser(userId) {
        await this.initialize();
        if (this.userId === userId) return;
        this.userId = userId;
        if (!userId) {
            this.state = { presupuesto: '0', emailAlert: false };
            this.notifyListeners();
            return;
        }
        await this.cargar();
    }

    async cargar() {
        if (!this.userId) return;
        const prefs = await this.service.obtenerPorUsuario(this.userId);
        this.state = {
            presupuesto: prefs.presupuesto,
            emailAlert: prefs.email_alert,
        };
        this.notifyListeners();
    }

    async guardar(preferencias) {
        if (!this.userId) throw new Error('No hay usuario activo.');
        const saved = await this.service.guardar({
            ...preferencias,
            id_usuario: this.userId,
        });
        this.state = {
            presupuesto: saved.presupuesto,
            emailAlert: saved.email_alert,
        };
        this.notifyListeners();
        return saved;
    }

    setPresupuestoLocal(valor) {
        this.state = { ...this.state, presupuesto: valor };
        this.notifyListeners();
    }

    setEmailAlertLocal(flag) {
        this.state = { ...this.state, emailAlert: flag };
        this.notifyListeners();
    }
}

export default new PreferenciasController();
