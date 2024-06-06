import { Router } from 'express';
import { createUsuario } from '../controllers/usuarios.js';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/index.js';

const router = Router();

router.post('/', [
    check('documento_usuario.tipo')
        .notEmpty().withMessage('El tipo de documento es obligatorio')
        .isInt().withMessage('El tipo de documento debe ser un número entero'),
    check('documento_usuario.numero')
        .notEmpty().withMessage('El número de documento es obligatorio')
        .isFloat().withMessage('El número de documento debe ser un número real')
        .isLength({ min: 6, max: 10  }).withMessage('El número de documento debe tener al menos 6 caracteres y máximo 10'),
    check('nombre_usuario').notEmpty().withMessage('El nombre es obligatorio'),
    check('primer_apellido_usuario').notEmpty().withMessage('El primer apellido es obligatorio'),
    check('correo_usuario').isEmail().withMessage('Debe ser un correo electrónico válido'),
    check('password_usuario')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/^(?=.*[A-Z])(?=.*\d)/).withMessage('La contraseña debe contener al menos una letra mayúscula y un número'),
    check('fecha_nacimiento_usuario').notEmpty().withMessage('La fecha de nacimiento es obligatoria'),
    check('telefono_usuario.celular')
        .notEmpty().withMessage('El número de celular es obligatorio')
        .isNumeric().withMessage('El número de celular debe ser numérico')
        .isLength({ min: 10, max: 10 }).withMessage('El número de celular debe tener 10 caracteres')
        .matches(/^3/).withMessage('El número de celular debe empezar por 3'),
    check('telefono_usuario.fijo')
        .optional().isNumeric().withMessage('El número de teléfono fijo debe ser numérico')
        .isLength({ min: 10, max: 10 }).withMessage('El número de teléfono fijo debe tener hasta 10 caracteres')
        .custom((value, { req }) => value ? value : null).withMessage('El número de teléfono fijo debe ser nulo si está vacío'),
    check('estado_usuario').notEmpty().withMessage('El estado de usuario es obligatorio'),
    check('sexo_usuario').notEmpty().withMessage('El sexo de usuario es obligatorio'),
    check('rol_usuario').notEmpty().withMessage('El rol de usuario es obligatorio'),
    validarCampos,
], createUsuario);

export default router;
