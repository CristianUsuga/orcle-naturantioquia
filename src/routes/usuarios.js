import { Router } from 'express';
import { check } from 'express-validator';
// import { createUsuario, updateUsuario, getUsuarios, deleteUsuario } from '../controllers/usuarios.js';
import { createUsuario, deleteUsuario, activateUser, getUsuarios, getUsuario, updateUsuario, updateUsuarioSinPassword   } from '../controllers/usuarios.js';
import { validarCampos, validarEdadMinima, esAdminOMismoUsuario, validarJWT, esAdminRole, verificarPermiso, verificarPermisoLectura, tieneRol, esMismoUsuario    } from '../middlewares/index.js';

const router = Router();

router.get('/:id', [
    validarJWT,
    esAdminOMismoUsuario // Permite acceso al administrador o al propio usuario
], getUsuario);

router.get('/', [
    validarJWT,
    tieneRol(2, 3) // Solo permite Administrador (2) y Delegado (3)
], getUsuarios);

router.post('/', [
    check('documento_usuario')
        .isNumeric().withMessage('El número de documento debe ser un número')
        .isLength({ min: 7, max: 10 }).withMessage('El número de documento debe tener entre 7 y 10 dígitos'),
    
    check('nombre')
        .notEmpty().withMessage('El nombre es obligatorio'),

    check('fijo')
        .optional()
        .isNumeric().withMessage('El número de teléfono fijo debe ser un número')
        .isLength({ min: 10, max: 10 }).withMessage('El número de teléfono fijo debe tener exactamente 10 dígitos')
        .matches(/^60/).withMessage('Número fijo debe empezar con 60 + indicativo + número'),

    check('celular')
        .isNumeric().withMessage('El número de celular debe ser un número')
        .isLength({ min: 10, max: 10 }).withMessage('El número de celular debe tener exactamente 10 dígitos')
        .matches(/^3/).withMessage('El número de celular debe comenzar con 3'),

    check('correo')
        .isEmail().withMessage('Debe ser un correo válido'),

    check('primer_apellido_usuario')
        .notEmpty().withMessage('El primer apellido es obligatorio')
        .isLength({ min: 1 }).withMessage('El primer apellido debe tener al menos un carácter'),

    check('segundo_apellido_usuario')
        .optional()
        .isLength({ min: 1 }).withMessage('El segundo apellido debe tener al menos un carácter si se proporciona'),

    check('password_usuario')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/^(?=.*[A-Z])(?=.*\d)/).withMessage('La contraseña debe contener al menos una letra mayúscula y un número')
        .notEmpty().withMessage('La contraseña es obligatoria'),

    validarEdadMinima(14),

    check('tipo_documento')
        .isInt().withMessage('El tipo de documento debe ser un número entero')
        .notEmpty().withMessage('El tipo de documento es obligatorio'),

    check('estado_usuario')
        .isInt().withMessage('El estado del usuario debe ser un número entero')
        .notEmpty().withMessage('El estado del usuario es obligatorio'),

    check('sexo_usuario')
        .isInt().withMessage('El sexo del usuario debe ser un número entero')
        .notEmpty().withMessage('El sexo del usuario es obligatorio'),

    check('rol_usuario')
        .isInt().withMessage('El rol del usuario debe ser un número entero')
        .notEmpty().withMessage('El rol del usuario es obligatorio'),

    validarCampos
], createUsuario);


router.put('/admin/:id', [
    validarJWT,
    tieneRol(2, 3), // Solo permite acceso a Administradores (2) y Delegados (3)
    check('nombre')
        .optional()
        .notEmpty().withMessage('El nombre es opcional'),
    check('primer_apellido_usuario')
        .optional()
        .notEmpty().withMessage('El primer apellido es opcional '),
    check('segundo_apellido_usuario')
        .optional()
        .isLength({ min: 1 }).withMessage('El segundo apellido debe tener al menos un carácter si se proporciona'),
    check('fijo')
        .optional()
        .isNumeric().withMessage('El número de teléfono fijo debe ser un número')
        .isLength({ min: 10, max: 10 }).withMessage('El número de teléfono fijo debe tener exactamente 10 dígitos')
        .matches(/^60/).withMessage('Número fijo debe empezar con 60 + indicativo + número'),
    check('celular')
        .optional()
        .isNumeric().withMessage('El celular debe ser un número')
        .isLength({ min: 10, max: 10 }).withMessage('El celular debe tener exactamente 10 dígitos')
        .matches(/^3/).withMessage('El celular debe comenzar con 3'),
    check('correo')
        .optional()
        .isEmail().withMessage('Debe ser un correo válido'),
    check('fecha_nacimiento_usuario')
        .optional()
        .isDate({ format: 'YYYY-MM-DD' }).withMessage('La fecha de nacimiento debe tener el formato YYYY-MM-DD'),
        check('tipo_documento')
        .optional()
        .isInt().withMessage('El tipo de documento debe ser un número entero'),
    check('estado_usuario')
        .optional()
        .isInt().withMessage('El estado del usuario debe ser un número entero'),
    check('sexo_usuario')
        .optional()
        .isInt().withMessage('El sexo del usuario debe ser un número entero'),
    check('rol_usuario')
        .optional()
        .isInt().withMessage('El rol del usuario debe ser un número entero'),

    validarCampos
], updateUsuarioSinPassword);



router.put('/:id', [
    validarJWT,
    esMismoUsuario, // Permite acceso solo al propio usuario
    check('nombre').optional().notEmpty().withMessage('El nombre es obligatorio'),
    check('primer_apellido_usuario').optional().notEmpty().withMessage('El primer apellido es obligatorio'),
    check('segundo_apellido_usuario').optional().isLength({ min: 1 }).withMessage('El segundo apellido debe tener al menos un carácter si se proporciona'),
    check('fijo').optional().isNumeric().withMessage('El teléfono fijo debe ser un número').isLength({ min: 10, max: 10 }).matches(/^60/).withMessage('Número fijo debe empezar con 60'),
    check('celular').optional().isNumeric().withMessage('El celular debe ser un número').isLength({ min: 10, max: 10 }).matches(/^3/).withMessage('El celular debe empezar con 3'),
    check('correo').optional().isEmail().withMessage('Debe ser un correo válido'),
    check('password_usuario').optional().isLength({ min: 8 }).matches(/^(?=.*[A-Z])(?=.*\d)/).withMessage('La contraseña debe tener al menos una letra mayúscula y un número'),
    validarCampos
], updateUsuario);
// router.get('/', getUsuarios);

//router.put('/reactive/:id',[validarJWT, esAdminRole],activateUser);

router.put('/reactive/:id', [
    validarJWT,
    esAdminRole
], activateUser);


router.delete('/:id', [
    validarJWT,
    esAdminOMismoUsuario,
    validarCampos
], deleteUsuario);

//Pruebas de perfiles
router.post('/formulario', [
    validarJWT,
    verificarPermiso('Formulario de Usuarios', 'eliminar')
], (req, res) => {
    res.json({ msg: 'Operación de inserción realizada' });
});

router.get('/formulario', [
    validarJWT,
    verificarPermisoLectura('Formulario de Usuarios')
], (req, res) => {
    res.json({ msg: 'Operación de lectura realizada' });
});


export default router;
