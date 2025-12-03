export default class Preferencias {
    constructor({ id_usuario, presupuesto = '0', email_alert = false, emailAlert = false }) {
        this.id_usuario = id_usuario;
        this.presupuesto = (presupuesto ?? '0').toString();
        const normalizedEmail = typeof email_alert !== 'undefined' ? email_alert : emailAlert;
        this.emailAlert = Boolean(normalizedEmail);
        this.email_alert = this.emailAlert;
    }

    validar() {
        if (!this.id_usuario) {
            throw new Error('Las preferencias requieren un usuario asociado.');
        }
        if (Number.isNaN(parseFloat(this.presupuesto))) {
            throw new Error('El presupuesto debe ser numérico.');
        }
    }

    toPersistence() {
        this.validar();
        return {
            id_usuario: this.id_usuario,
            presupuesto: this.presupuesto,
            email_alert: this.emailAlert ? 1 : 0,
        };
    }
}
