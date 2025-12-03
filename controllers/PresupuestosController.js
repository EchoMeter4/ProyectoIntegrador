import BaseController from './BaseController';
import PresupuestosService from '../database/PresupuestosService';

class PresupuestosController extends BaseController {
    constructor() {
        super();
        this.service = new PresupuestosService();
        this.initialized = false;
        this.userId = null;
        this.state = {
            presupuestos: [],
            lastUpdated: Date.now(),
        };
    }

    async initialize() {
        if (this.initialized) return;
        await this.service.initialize();
        this.initialized = true;
    }

    getState() {
        return this.state;
    }

    async setUser(userId) {
        await this.initialize();
        if (this.userId === userId) return;
        this.userId = userId;
        if (!userId) {
            this.state = { presupuestos: [], lastUpdated: Date.now() };
            this.notifyListeners();
            return;
        }
        await this.cargar();
    }

    async cargar() {
        if (!this.userId) {
            this.state = { presupuestos: [], lastUpdated: Date.now() };
            this.notifyListeners();
            return;
        }
        const presupuestos = await this.service.listarPorUsuario(this.userId);
        this.state = { presupuestos, lastUpdated: Date.now() };
        this.notifyListeners();
    }

    async obtenerPorMes(year, month) {
        if (!this.userId) return [];
        return this.service.listarPorMes(this.userId, year, month);
    }

    async agregar(data) {
        if (!this.userId) throw new Error('Usuario no establecido para presupuestos.');
        await this.service.agregar({ ...data, id_usuario: this.userId });
        await this.cargar();
    }

    async editar(id, data) {
        if (!this.userId) throw new Error('Usuario no establecido para presupuestos.');
        await this.service.editar(id, { ...data, id_usuario: this.userId });
        await this.cargar();
    }

    async eliminar(id) {
        if (!this.userId) throw new Error('Usuario no establecido para presupuestos.');
        await this.service.eliminar(id, this.userId);
        await this.cargar();
    }
}

const controller = new PresupuestosController();
export default controller;

