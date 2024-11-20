import { response, request } from 'express';
import bcryptjs from 'bcryptjs';
import { generarJWT } from '../helpers/generar-jwt.js';
import { findUserByEmailAuth } from '../models/usuarios.js';

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

        // Verificar el estado del usuario (ID 1 para Activo)
        if (usuario.estado_usuario.id !== 1) {
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

        // Configurar la cookie del JWT
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 1 día
        });

        // Redirigir según el rol del usuario, manejar error si el rol no existe
        switch (usuario.rol_usuario) {
            case 2:
                return res.json({ msg: 'Inicio de sesión exitoso', redirectTo: '/admin' });
            case 3:
                return res.json({ msg: 'Inicio de sesión exitoso', redirectTo: '/delegado' });
            case 4:
                return res.json({ msg: 'Inicio de sesión exitoso', redirectTo: '/inventarios' });
            case 5:
                return res.json({ msg: 'Inicio de sesión exitoso', redirectTo: '/vendedor' });
            default:
                return res.json({ msg: 'Inicio de sesión exitoso', redirectTo: '/cliente' });
        }

    } catch (error) {
        console.error('Error en el controlador de login:', error);
        return res.status(500).json({ msg: 'Hable con el administrador' });
    }
};

// Controlador para el cierre de sesión
const logout = (req = request, res = response) => {
    // Limpiar la cookie del token
    res.clearCookie('token');
    res.redirect('/login');
};

export { login, logout };
