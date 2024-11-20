// src/middlewares/validar-rol.js
import { request, response } from 'express';
import { getUserById } from '../models/usuarios.js';

// Middleware general para verificar rol
const validarRolUsuario = (rolId, nombreRol) => {
    return async (req = request, res = response, next) => {
        if (!req.usuario) {
            return res.status(500).json({ msg: 'Primero debes validar el token.' });
        }

        try {
            const usuario = await getUserById(req.usuario.documento_usuario);
            
            if (!usuario) {
                return res.status(404).json({ msg: 'Usuario no encontrado en la base de datos.' });
            }
            // Validar rol
            if (usuario.rol_usuario !== rolId) {
                console.log("holaaaaaaaa dentro ", usuario.rol_usuario , rolId )
                return res.status(401).json({ msg: `${usuario.nombre}  no tiene permisos de ${nombreRol}` });
            }
            req.usuario = usuario;
            next();
        } catch (error) {
            console.error(`Error al verificar rol de ${nombreRol}:`, error);
            return res.status(500).json({ msg: 'Error interno al verificar rol de usuario.' });
        }
    };
};

// Exportar middlewares de rol
const esAdminRole = validarRolUsuario(2, 'Administrador');
const esClienteRole = validarRolUsuario(1, 'Cliente');
const esDelegadoRole = validarRolUsuario(3, 'Delegado');
const esInventariosRole = validarRolUsuario(4, 'Inventarios');
const esVendedorRole = validarRolUsuario(5, 'Vendedor');

export { esAdminRole, esClienteRole, esDelegadoRole, esInventariosRole, esVendedorRole };
