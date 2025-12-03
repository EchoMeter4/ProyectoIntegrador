import BaseController from './BaseController';
import TransaccionesService from '../database/TransaccionesService';

class TransaccionesController extends BaseController {
    constructor() {
        super();
        this.service = new TransaccionesService();
        this.initialized = false;
        this.userId = null;
        this.state = {
            transacciones: [],
            activeFilter: 'all',
            filterMonthYear: new Date().toISOString().substring(0, 7),
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
            this.state = { ...this.state, transacciones: [] };
            this.notifyListeners();
            return;
        }

        await this.cargar();
    }

    async setActiveFilter(filter) {
        if (this.state.activeFilter === filter) return;
        this.state = { ...this.state, activeFilter: filter };
        await this.cargar();
    }

    async setFilterMonthYear(mesAnio) {
        if (this.state.filterMonthYear === mesAnio) return;
        this.state = { ...this.state, filterMonthYear: mesAnio };
        await this.cargar();
    }

    async cargar() {
        if (!this.userId) {
            this.state = { ...this.state, transacciones: [] };
            this.notifyListeners();
            return;
        }

        const transacciones = await this.service.listarPorUsuario({
            userId: this.userId,
            tipo: this.state.activeFilter,
            mesAnio: this.state.filterMonthYear,
        });

        this.state = { ...this.state, transacciones };
        this.notifyListeners();
    }

    async agregar(data) {
        if (!this.userId) throw new Error('Usuario no establecido para transacciones.');
        const result = await this.service.agregar({ ...data, id_usuario: this.userId });
        await this.cargar();
        return result;
    }

    async editar(id, data) {
        if (!this.userId) throw new Error('Usuario no establecido para transacciones.');
        const result = await this.service.editar(id, { ...data, id_usuario: this.userId });
        await this.cargar();
        return result;
    }

    async eliminar(id) {
        if (!this.userId) throw new Error('Usuario no establecido para transacciones.');
        await this.service.eliminar(id, this.userId);
        await this.cargar();
    }

    async obtenerParaGraficas() {
        if (!this.userId) return [];
        return this.service.obtenerTodasParaGraficas(this.userId);
    }
}

const controller = new TransaccionesController();
export default controller;
