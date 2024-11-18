import { response, request } from 'express';
import bcryptjs from 'bcryptjs';

import { findUserByEmailAuth } from '../models/usuarios.js';
import { generarJWT } from '../helpers/generar-jwt.js';

const login = async (req = request, res = response) => {
    const { correo, password } = req.body;

    try {
        // Verificar si el usuario existe
        const usuario = await findUserByEmailAuth(correo);
        if (!usuario) {
            return res.status(400).json({   
                msg: 'Usuario / Password no son válidos - correo'
            });
        }

        // Verificar el estado del usuario
        if (usuario.estado_usuario.id !== 1) { // Estado "Activo" tiene ID 1
            return res.status(400).json({   
                msg: 'Usuario no activo o bloqueado - Estado'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        // Generar el JWT si todo es válido
        const token = await generarJWT(usuario.documento_usuario);
        res.json({ usuario, token });

    } catch (error) {
        console.error('Error en el controlador de login:', error);
        return res.status(500).json({ msg: 'Hable con el administrador' });
    }
};

export { login };
