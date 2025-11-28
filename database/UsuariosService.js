import bcrypt from 'bcrypt';

export default class UsuariosService {
    constructor(db) {
        this.db = db;
    }

    async add({usuario, nombre, correo, password}) {
        return await this.db.runAsync(`
            INSERT INTO
                usuarios (usuario, nombre, correo, password)
            VALUES (?, ?, ?, ?)
        `, [usuario, nombre, correo, hashed]);
    }

    async update({id, usuario, nombre, correo, password}) {
        return await this.db.runAsync(`
            UPDATE usuarios
            SET usuario = ?,
                nombre = ?,
                correo = ?,
                password = ?
            WHERE id = ?
        `, [usuario, nombre, correo, password, id])
    }

    async getById(id) {
        const usuario = await this.db.getFirstAsync(`
            SELECT * FROM usuarios WHERE id = ?
        `, [id])

        if (usuario === null) {
            throw new Error(`No se pudo encontrar el usuario con id: ${id}.`)
        }

    }
}