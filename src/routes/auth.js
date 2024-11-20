// src/routes/auth.js
import { Router } from 'express';
import { check } from 'express-validator';

import { login, logout } from '../controllers/auth.js';
import { validarCampos } from '../middlewares/validar-campos.js';

const router = Router();

router.post('/login', [
    check('correo', 'El correo es obligatorio y debe ser un correo válido').isEmail(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    validarCampos
], login);

router.get('/logout', logout);

export default router;
