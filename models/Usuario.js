export default class Usuario {
    constructor({id, alias, correo, password}) {
        this.id = id;
        this.alias = alias;
        this.correo = correo;
        this.password = password;
    }

    validarTodo() {
        this.validarAlias()
        // this.validarNombre() we're missing this actually lol
        this.validarCorreo()
        this.validarPassword()
    }

    validarCorreo() {
        const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (regex.test(this.correo)) return true;
        throw new Error("El correo es inválido.");
    }

    validarAlias() {
        if (this.alias.trim().length >= 8) return true;
        throw new Error("El alias debe contener al menos 8 carácteres.");
    }

    validarPassword() {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (passwordRegex.test(this.password)) return true;
        throw new Error(
            "La contraseña debe incluir al menos 8 carácteres, una mayúscula," +
            " una minúscula y un numero."
        )
    }

    // validarNombre() {
    //     if (this.nombre.length > 0) return true;
    //     throw new Error('El nombre debe contener al menos un carácter.')
    // }

    toString() {
        return JSON.stringify(this);
    }

    authenticate(password) {
        if (password === this.password) return true;
        throw new Error("Contraseña incorrecta.")
    }
}