import { Router } from 'express';
import { check } from 'express-validator';

import { obtenerEstadosUsuarios, obtenerEstadoUsuarioPorId, crearEstadoUsuario, actualizarEstadoUsuario, eliminarEstadoUsuario  } from '../controllers/estadosUsuarios.js';
import { validarCampos, validarJWT, verificarPermisoLectura, verificarPermiso } from '../middlewares/index.js';

const router = Router();

router.get('/', [ validarJWT, verificarPermisoLectura('estadoUsuarios'),validarCampos], obtenerEstadosUsuarios); // Obtener todos los estados
router.get('/:id',[  validarJWT, verificarPermisoLectura('estadoUsuarios'),validarCampos], obtenerEstadoUsuarioPorId); // Obtener un estado por ID


router.post(
    '/',
    [
        validarJWT,
        verificarPermiso('estadoUsuarios', 'insertar'),
        check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
        validarCampos
    ],
    crearEstadoUsuario
);

router.put(
    '/:id',
    [
        validarJWT,
        verificarPermiso('estadoUsuarios', 'actualizar'),
        check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
        validarCampos
    ],
    actualizarEstadoUsuario
);

router.delete(
    '/:id',
    [
        validarJWT,
        verificarPermiso('estadoUsuarios', 'eliminar'),
        validarCampos
    ],
    eliminarEstadoUsuario
);



export default router;
