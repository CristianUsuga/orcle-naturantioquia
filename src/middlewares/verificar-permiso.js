import { request, response } from 'express';
import { getUserById } from '../models/usuarios.js';
import { getPermisos, getPermisosLectura } from '../models/perfiles.js';

const verificarPermiso = (nombreFormulario, permiso) => {
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

            // Obtener permisos del usuario en el formulario
            const permisos = await getPermisos(usuario.rol_usuario, nombreFormulario);

            if (!permisos || !permisos.lectura) {
                return res.status(403).json({
                    msg: 'No tiene permisos de lectura en este formulario'
                });
            }

            // Verificar el permiso específico solicitado (insertar, actualizar, eliminar)
            if (!permisos[permiso]) {
                return res.status(403).json({
                    msg: `No tiene permisos para ${permiso} en este formulario`
                });
            }

            // Si tiene los permisos, continuar con la solicitud
            next();
        } catch (error) {
            console.error('Error al verificar permisos:', error);
            res.status(500).json({
                msg: 'Error interno al verificar permisos de usuario'
            });
        }
    };
};

const verificarPermisoLectura = (nombreFormulario) => {
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

            // Verificar permiso de lectura en el formulario
            const tienePermisoLectura = await getPermisosLectura(usuario.rol_usuario, nombreFormulario);

            if (!tienePermisoLectura) {
                return res.status(403).json({
                    msg: `No tiene permisos de lectura en el formulario ${nombreFormulario}`
                });
            }

            // Si tiene permiso de lectura, continuar
            next();
        } catch (error) {
            console.error('Error al verificar permisos de lectura:', error);
            res.status(500).json({
                msg: 'Error interno al verificar permisos de lectura'
            });
        }
    };
};

export { verificarPermiso, verificarPermisoLectura };
