
import DatabaseService from "./DatabaseService";
import Usuario from "../models/Usuario";

export default class UsuariosService {
    constructor() {
        
        this.dbService = DatabaseService;
    }

    async initialize() {
        try {
            
            if (!this.dbService.getDB()) {
                await this.dbService.initialize();
            }
        } catch (error) {
            console.error(`Error al inicializar UsuariosService: ${error}`);
        }
    }

    async add(usuario) {
        const { alias, correo, password } = usuario;
        
        
        const db = this.dbService.getDB();
        
        
        if (!db) {
            await this.initialize();
            if (!this.dbService.getDB()) throw new Error("Base de datos no disponible");
        }

        
        const result = await this.dbService.getDB().runAsync(`
            INSERT INTO usuarios (alias, correo, password)
            VALUES (?, ?, ?)
        `, alias, correo, password);

        usuario.id = result.lastInsertRowId;
        return usuario;
    }

    async update(usuario) {
        const { id, alias, correo, password } = usuario;
        const db = this.dbService.getDB();

        
        return await db.runAsync(`
            UPDATE usuarios
            SET alias = ?, correo = ?, password = ?
            WHERE id = ?
        `, alias, correo, password, id);
    }

    async getById(id) {
        const db = this.dbService.getDB();
        
        const usuario = await db.getFirstAsync(`
            SELECT * FROM usuarios WHERE id = ?
        `, id);

        if (!usuario) {
            throw new Error(`No se pudo encontrar el usuario con id: "${id}".`);
        }

        return new Usuario(usuario);
    }

    async getByCorreo(correo) {
        
        if (!this.dbService.getDB()) await this.initialize();

        
        const usuario = await this.dbService.getDB().getFirstAsync(`
            SELECT * FROM usuarios WHERE correo = ?
        `, correo);

        if (!usuario) return null; 

        return new Usuario(usuario);
    }

    async getByAlias(alias) {
        const db = this.dbService.getDB();
        
        const usuario = await db.getFirstAsync(`
            SELECT * FROM usuarios WHERE alias = ?
        `, alias);

        if (!usuario) return null;

        return new Usuario(usuario);
    }
}