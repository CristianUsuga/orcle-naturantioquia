import { Router } from 'express';
import { check } from 'express-validator';

import {  obtenerRoles, obtenerRolPorId, crearRol, actualizarRol, eliminarRol  } from '../controllers/roles.js';
import { validarCampos, validarJWT, verificarPermisoLectura, verificarPermiso } from '../middlewares/index.js';

const router = Router();

router.get('/', [ validarJWT, verificarPermisoLectura('roles'),validarCampos], obtenerRoles); // Obtener todos los roles
router.get('/:id',[  validarJWT, verificarPermisoLectura('roles'),validarCampos], obtenerRolPorId); // Obtener un rol por ID


router.post(
    '/',
    [
        validarJWT,
        verificarPermiso('roles', 'insertar'),
        check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
        validarCampos
    ],
    crearRol
);

router.put(
    '/:id',
    [
        validarJWT,
        verificarPermiso('roles', 'actualizar'),
        check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
        validarCampos
    ],
    actualizarRol
);

router.delete(
    '/:id',
    [
        validarJWT,
        verificarPermiso('roles', 'eliminar'),
        validarCampos
    ],
    eliminarRol
);



export default router;
