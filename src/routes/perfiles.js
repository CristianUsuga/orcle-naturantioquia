import { Router } from 'express';
import { check } from 'express-validator';
import { validarJWT, verificarPermisoLectura, verificarPermiso, validarCampos } from '../middlewares/index.js';
import {
    obtenerPerfiles,
    obtenerPerfilPorId,
    crearPerfil,
    actualizarPerfil,
    eliminarPerfil,
    obtenerPerfilesFormateados
} from '../controllers/perfiles.js';

const router = Router();

router.get('/', [
    validarJWT,
    verificarPermisoLectura('perfiles'),
    validarCampos
], obtenerPerfiles);

router.get('/:idPerfil/:idFormulario', [
    validarJWT,
    verificarPermisoLectura('perfiles'),
    validarCampos
], obtenerPerfilPorId);

router.post('/', [
    validarJWT,
    verificarPermiso('perfiles', 'insertar'),
    check('idPerfil').isInt().withMessage('El ID del perfil debe ser un número entero'),
    check('idFormulario').isInt().withMessage('El ID del formulario debe ser un número entero'),
    check('insertar').isIn([0, 1]).withMessage('El permiso de insertar debe ser 0 o 1'),
    check('actualizar').isIn([0, 1]).withMessage('El permiso de actualizar debe ser 0 o 1'),
    check('eliminar').isIn([0, 1]).withMessage('El permiso de eliminar debe ser 0 o 1'),
    validarCampos
], crearPerfil);

router.put('/:idPerfil/:idFormulario', [
    validarJWT,
    verificarPermiso('perfiles', 'actualizar'),
    check('insertar').optional().isIn([0, 1]).withMessage('El permiso de insertar debe ser 0 o 1'),
    check('actualizar').optional().isIn([0, 1]).withMessage('El permiso de actualizar debe ser 0 o 1'),
    check('eliminar').optional().isIn([0, 1]).withMessage('El permiso de eliminar debe ser 0 o 1'),
    validarCampos
], actualizarPerfil);

router.get(
    '/format',
    [
        validarJWT,
        verificarPermisoLectura('perfiles')
    ],
    obtenerPerfilesFormateados
);

router.delete('/:idPerfil/:idFormulario', [
    validarJWT,
    verificarPermiso('perfiles', 'eliminar'),
], eliminarPerfil);

export default router;
