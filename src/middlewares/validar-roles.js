import { request, response } from 'express';
import { getUserById } from '../models/usuarios.js';

// Middleware para verificar si el usuario tiene el rol de Administrador (ID 2)
const esAdminRole = async (req = request, res = response, next) => {
    await verificarRol(req, res, next, 2, 'Administrador');
};

// Middleware para verificar si el usuario tiene el rol de Cliente (ID 1)
const esClienteRole = async (req = request, res = response, next) => {
    await verificarRol(req, res, next, 1, 'Cliente');
};

// Middleware para verificar si el usuario tiene el rol de Delegado (ID 3)
const esDelegadoRole = async (req = request, res = response, next) => {
    await verificarRol(req, res, next, 3, 'Delegado');
};

// Middleware para verificar si el usuario tiene el rol de Inventarios (ID 4)
const esInventariosRole = async (req = request, res = response, next) => {
    await verificarRol(req, res, next, 4, 'Inventarios');
};

// Middleware para verificar si el usuario tiene el rol de Vendedor (ID 5)
const esVendedorRole = async (req = request, res = response, next) => {
    await verificarRol(req, res, next, 5, 'Vendedor');
};

// Función auxiliar para verificar un rol específico
const verificarRol = async (req, res, next, rolId, rolNombre) => {
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se requiere validar el token primero'
        });
    }

    try {
        const { documento_usuario } = req.usuario;
        const usuario = await getUserById(documento_usuario);

        if (!usuario) {
            return res.status(404).json({
                msg: 'Usuario no encontrado en la base de datos'
            });
        }

        // Verificar si el usuario tiene el rol especificado
        if (usuario.rol_usuario !== rolId) {
            return res.status(401).json({
                msg: `${usuario.nombre} no tiene permisos de ${rolNombre}`
            });
        }

        // Adjuntar la información completa del usuario en la solicitud
        req.usuario = usuario;
        next();
    } catch (error) {
        console.error(`Error al verificar rol de ${rolNombre}:`, error);
        res.status(500).json({
            msg: 'Error interno al verificar rol de usuario'
        });
    }
};

// Middleware para verificar que el usuario tenga uno de los roles especificados
const tieneRol = (...roles) => {
    return async (req = request, res = response, next) => {
        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se requiere validar el token primero'
            });
        }

        try {
            const { documento_usuario } = req.usuario;
            const usuario = await getUserById(documento_usuario);

            if (!usuario) {
                return res.status(404).json({
                    msg: 'Usuario no encontrado en la base de datos'
                });
            }

            // Verificar si el usuario tiene uno de los roles permitidos
            if (!roles.includes(usuario.rol_usuario)) {
                return res.status(401).json({
                    msg: `El usuario no tiene los permisos necesarios. Se requiere uno de estos roles: ${roles.join(', ')}`
                });
            }

            // Adjuntar la información completa del usuario en la solicitud
            req.usuario = usuario;
            next();
        } catch (error) {
            console.error('Error al verificar roles:', error);
            res.status(500).json({
                msg: 'Error interno al verificar roles del usuario'
            });
        }
    };
};

// Middleware para verificar que el usuario sea administrador o el mismo usuario
const esAdminOMismoUsuario = async (req = request, res = response, next) => {
    const { id } = req.params;

    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se requiere validar el token primero'
        });
    }

    try {
        // Obtener la información completa del usuario autenticado
        const usuario = await getUserById(req.usuario.documento_usuario);

        if (!usuario) {
            return res.status(404).json({
                msg: 'Usuario no encontrado en la base de datos'
            });
        }

        // Verificar si el usuario es administrador o el propio usuario
        if (usuario.rol_usuario === 2 || usuario.DOCUMENTO_USUARIO === parseInt(id, 10)) { // 2 es el rol de Administrador
            req.usuario = usuario; // Adjuntar la información completa del usuario para la solicitud
            return next();
        }

        // Si no es administrador ni el mismo usuario
        return res.status(401).json({
            msg: 'No tiene permisos para realizar esta acción'
        });
    } catch (error) {
        console.error('Error al verificar administrador o mismo usuario:', error);
        res.status(500).json({
            msg: 'Error interno al verificar permisos de usuario'
        });
    }
};

const esMismoUsuario = (req = request, res = response, next) => {
    const { id } = req.params;

    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se requiere validar el token primero'
        });
    }
    const { documento_usuario } = req.usuario;

    // Verificar si el usuario autenticado es el mismo usuario solicitado en la ruta
    if (documento_usuario === parseInt(id, 10)) {
        return next();
    }
    return res.status(401).json({
        msg: 'No tiene permisos para realizar esta acción'
    });
};


export { 
    esAdminRole, 
    esClienteRole, 
    esDelegadoRole, 
    esInventariosRole, 
    esVendedorRole, 
    tieneRol, 
    esAdminOMismoUsuario,
    esMismoUsuario
};
