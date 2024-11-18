import { Router } from 'express';
import { check } from 'express-validator';

import { login } from '../controllers/auth.js';
import { validarCampos } from '../middlewares/validar-campos.js';

const router = Router();

router.post('/login', [
    check('correo', 'El correo es obligatorio y debe ser un correo válido').isEmail(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    validarCampos
], login);

export default router;
