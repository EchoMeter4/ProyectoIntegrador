import DatabaseService from "./DatabaseService";
import Usuario from "../models/Usuario";

export default class UsuariosService {
    constructor() {
        this.dbService = DatabaseService;
    }

    async initialize() {
        try {
            await this.dbService.initialize();
        } catch (error) {
            console.error(`Error al inicializar UsuariosService: ${error}`)
            throw error;
        }
    }

    async add(usuario) {
        const {alias, correo, password} = usuario;

        const result = await this.dbService.db.runAsync(`
            INSERT INTO
                usuarios (alias, correo, password)
            VALUES
                (?, ?, ?)
        `, [alias, correo, password]);

        usuario.id = result.lastInsertRowId;
        return usuario;
    }

    async update(usuario) {
        const {id, alias, correo, password} = usuario;

        return await this.dbService.db.runAsync(`
            UPDATE usuarios
            SET
                alias    = ?,
                correo   = ?,
                password = ?
            WHERE
                id = ?
        `, [alias, correo, password, id]);
    }

    async getById(id) {
        const usuario = await this.dbService.db.getFirstAsync(`
            SELECT *
            FROM usuarios
            WHERE
                id = ?
        `, [id]);

        if (usuario === null) {
            throw new Error(`No se pudo encontrar el usuario con id: "${id}".`);
        }

        return new Usuario(usuario);
    }

    async getByCorreo(correo) {
        const usuario = await this.dbService.db.getFirstAsync(`
            SELECT *
            FROM usuarios
            WHERE
                correo = ?
        `, [correo]);

        if (usuario === null) {
            throw new Error(`No se pudo encontrar el usuario con correo: "${correo}".`);
        }

        return new Usuario(usuario);
    }

    async getByAlias(alias) {
        const usuario = await this.dbService.db.getFirstAsync(`
            SELECT *
            FROM usuarios
            WHERE
                alias = ?
        `, [alias]);

        if (usuario === null) {
            throw new Error(`No se pudo encontrar el usuario con alias: "${alias}".`);
        }

        return new Usuario(usuario);
    }
}