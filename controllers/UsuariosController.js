import BaseController from "./BaseController";
import UsuariosService from "../database/UsuariosService";
import Usuario from "../models/Usuario"; 

class UsuariosController extends BaseController {
    constructor() {
        super();
        this.userService = new UsuariosService();
    }

    async initialize() {
        await this.userService.initialize();
    }

    async crearUsuario(usuario) {
        try {
            usuario.validarTodo();
            const newUser = await this.userService.add(usuario);

            this.notifyListeners();
            console.log(`Usuario creado: ${newUser}`);

            return newUser;
        } catch (error) {
            console.error(
                `Error al crear usuario ${usuario}: ${error}`
            )
            throw error;
        }
    }

    async editarUsuario(usuario) {
        try {
            usuario.validarTodo();
            const updated = await this.userService.update(usuario);

            this.notifyListeners();
            console.log(`Usuario modificado: ${usuario}`);

            return updated;
        } catch (error) {
            console.error(`Error al editar usuario ${usuario}: ${error}`)
            throw error;
        }
    }

    async auth(usuario) {
        try {
            const {correo, alias} = usuario;

            let fresh;
            if (correo) {
                fresh = await this.userService.getByCorreo(correo);
            } else if (alias) {
                fresh = await this.userService.getByAlias(alias);
            } else {
                throw new Error('El usuario debe contener correo o alias.');
            }

            fresh.authenticate(usuario.password);
            return fresh;
        } catch (error) {
            
            console.error(`Error al autenticar: ${error}`) 
            throw error;
        }
    }
    
    
    async updatePassword(userId, currentPassword, newPassword) {
        try {
            
            const currentPassClean = (currentPassword || '').trim();
            const newPassClean = (newPassword || '').trim(); 
            
            
            const userRecord = await this.userService.getById(userId); 

            if (!userRecord) {
                throw new Error("Usuario no encontrado.");
            }
            
            
            const tempUser = new Usuario({ password: newPassClean });
            tempUser.validarPassword(); 

            
            try {
                userRecord.authenticate(currentPassClean); 
            } catch (authError) {
                
                throw new Error("La contraseña actual es incorrecta.");
            }
            
            
            const updated = await this.userService.updatePassword(userId, newPassClean);

            if (!updated) {
                throw new Error("No se pudo actualizar la contraseña en la base de datos.");
            }
            
            this.notifyListeners(); 
            console.log(`Contraseña actualizada para el usuario ID: ${userId}`);
            
            return true;
            
        } catch (error) {
            
            console.error("Error al actualizar la contraseña:", error);
            throw error; 
        }
    }
}

export default new UsuariosController();