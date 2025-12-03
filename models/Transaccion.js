export default class Transaccion {
    constructor({ id, id_usuario, monto, categoria, descripcion = '', fecha, tipo }) {
        this.id = id;
        this.id_usuario = id_usuario;
        this.monto = monto;
        this.categoria = categoria;
        this.descripcion = descripcion;
        this.fecha = fecha;
        this.tipo = tipo;
    }

    validarCamposRequeridos() {
        if (!this.id_usuario) {
            throw new Error('La transacción necesita un usuario asociado.');
        }
        if (!this.monto && this.monto !== 0) {
            throw new Error('El monto es obligatorio.');
        }
        if (!this.categoria) {
            throw new Error('La categoría es obligatoria.');
        }
        if (!this.tipo) {
            throw new Error('El tipo de transacción es obligatorio.');
        }
        if (!this.fecha) {
            throw new Error('La fecha es obligatoria.');
        }
    }

    normalizarMonto() {
        const numeric = Number(this.monto);
        if (Number.isFinite(numeric)) {
            this.monto = Number(numeric.toFixed(2));
        } else if (typeof this.monto === 'string') {
            const limpio = this.monto.replace(/[$,\s]/g, '');
            const fallback = Number(limpio);
            this.monto = Number.isFinite(fallback) ? Number(fallback.toFixed(2)) : 0;
        } else {
            this.monto = 0;
        }
    }

    prepararParaPersistencia() {
        this.normalizarMonto();
        this.validarCamposRequeridos();
        return {
            id_usuario: this.id_usuario,
            monto: this.monto,
            categoria: this.categoria,
            descripcion: this.descripcion || '',
            fecha: this.fecha,
            tipo: this.tipo,
        };
    }
}
