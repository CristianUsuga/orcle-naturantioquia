// src/middlewares/validar-rol.js
const validarRol = {
    soloPublico: (req, res, next) => {
        // Lógica para validar roles públicos
        next();
    },
    soloAdmin: (req, res, next) => {
        // Lógica para validar roles de administrador
        next();
    }
};

export { validarRol as methods };
