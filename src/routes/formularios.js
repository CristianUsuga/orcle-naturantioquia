import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { verificarPermisoLectura, verificarPermiso } from '../middlewares/verificar-permiso.js';

import { obtenerFormularios, obtenerFormularioPorId, crearFormulario, actualizarFormulario, eliminarFormulario } from '../controllers/formularios.js';

const router = Router();

router.get(
    '/',
    [validarJWT, verificarPermisoLectura('formularios'), validarCampos],
    obtenerFormularios
);

router.get(
    '/:id',
    [validarJWT, verificarPermisoLectura('formularios'), validarCampos],
    obtenerFormularioPorId
);

router.post(
    '/',
    [
        validarJWT,
        verificarPermiso('formularios', 'insertar'),
        check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
        check('nodoPrincipal').isIn([0, 1]).withMessage('El nodo principal debe ser 0 o 1'),
        check('modulo').isIn([0, 1]).withMessage('El módulo debe ser 0 o 1'),
        check('orden').isNumeric().withMessage('El orden debe ser un número'),
        check('url').notEmpty().withMessage('La URL es obligatoria'),
        validarCampos,
    ],
    crearFormulario
);

router.put(
    '/:id',
    [
        validarJWT,
        verificarPermiso('formularios', 'actualizar'),
        check('nombre').optional().notEmpty().withMessage('El nombre es obligatorio'),
        check('nodoPrincipal').optional().isIn([0, 1]).withMessage('El nodo principal debe ser 0 o 1'),
        check('modulo').optional().isIn([0, 1]).withMessage('El módulo debe ser 0 o 1'),
        check('orden').optional().isNumeric().withMessage('El orden debe ser un número'),
        check('url').optional().notEmpty().withMessage('La URL es obligatoria'),
        validarCampos,
    ],
    actualizarFormulario
);

router.delete(
    '/:id',
    [validarJWT, verificarPermiso('formularios', 'eliminar'), validarCampos],
    eliminarFormulario
);

export default router;
