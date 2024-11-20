import jwt from 'jsonwebtoken';
import { getUserById } from '../models/usuarios.js';

const validarJWT = async (req, res, next) => {
    const token = req.cookies.token || req.headers['x-token'];

    if (!token) {
        return res.status(401).json({ msg: 'No hay token en la petición' });
    }

    try {
        const { documento_usuario } = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await getUserById(documento_usuario);

        if (!usuario) {
            return res.status(401).json({ msg: 'Token no válido - usuario no existe en DB' });
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        console.error('Error al validar JWT:', error);
        res.status(401).json({ msg: 'Token no válido' });
    }
};

export { validarJWT };
