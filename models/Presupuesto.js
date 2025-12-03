export default class Presupuesto {
    constructor({ id, id_usuario, categoria, monto, limite_notificacion, year, month }) {
        this.id = id;
        this.id_usuario = id_usuario;
        this.categoria = categoria;
        this.monto = Number(monto) || 0;
        this.limite_notificacion = Number(limite_notificacion) || 0;
        this.year = year;
        this.month = month;
    }

    validar() {
        if (!this.id_usuario) throw new Error('El presupuesto necesita un usuario.');
        if (!this.categoria) throw new Error('La categoría es requerida.');
        if (!Number.isFinite(this.monto) || this.monto <= 0) {
            throw new Error('El monto debe ser mayor a 0.');
        }
        if (!Number.isFinite(this.year) || !Number.isFinite(this.month)) {
            throw new Error('Mes y año inválidos.');
        }
    }

    toPersistence() {
        this.validar();
        return {
            id: this.id,
            id_usuario: this.id_usuario,
            categoria: this.categoria,
            monto: Number(this.monto.toFixed(2)),
            limite_notificacion: Number(this.limite_notificacion.toFixed(2)),
            year: this.year,
            month: this.month,
        };
    }
}

