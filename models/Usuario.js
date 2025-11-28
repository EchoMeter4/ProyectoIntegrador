import bcrpyt from 'bcrypt';

export default class Usuario {
    constructor(usuario, nombre, correo, password, id = undefined) {
        this.id = id;
        this.usuario = usuario;
        this.nombre = nombre;
        this.correo = correo;
        this.password = bcrpyt.hash(password);
    }
}