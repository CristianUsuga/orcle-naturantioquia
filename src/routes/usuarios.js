import { Router } from 'express';
import { check } from 'express-validator';
// import { createUsuario, updateUsuario, getUsuarios, deleteUsuario } from '../controllers/usuarios.js';
import { createUsuario } from '../controllers/usuarios.js';
import { validarCampos, validarEdadMinima } from '../middlewares/index.js';

const router = Router();

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

// router.put('/:documento_numero', [
//     check('documento_usuario.tipo').optional().isInt().withMessage('El tipo de documento debe ser un número entero'),
//     check('documento_usuario.numero').optional().isNumeric().withMessage('El número de documento debe ser un número').isLength({ min: 7, max:10 }).withMessage('El número de documento debe tener al menos 7 caracteres'),
//     check('nombre_usuario').optional().notEmpty().withMessage('El nombre de usuario es obligatorio'),
//     check('correo_usuario').optional().isEmail().withMessage('Debe ser un correo válido'),
//     check('password_usuario').optional().isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres').matches(/^(?=.*[A-Z])(?=.*\d)/).withMessage('La contraseña debe contener al menos una letra mayúscula y un número'),
//     check('fecha_nacimiento_usuario').optional().notEmpty().withMessage('La fecha de nacimiento es obligatoria'),
//     check('telefono_usuario.celular').optional().isNumeric().withMessage('El número de celular debe ser un número').isLength({ min:10,max: 10 }).withMessage('El número de celular no puede tener más de 10 dígitos').matches(/^3/).withMessage('El número de celular debe comenzar con 3'),
//     check('telefono_usuario.fijo').optional().isNumeric().withMessage('El número de teléfono fijo debe ser un número').isLength({ min:10, max: 10 }).withMessage('El número de teléfono fijo no puede tener más de 10 dígitos'),
//     validarCampos
// ], updateUsuario);

// router.get('/', getUsuarios);

// router.delete('/:documento_numero', deleteUsuario);

export default router;
