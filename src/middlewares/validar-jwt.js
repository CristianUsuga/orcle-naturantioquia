import jwt from 'jsonwebtoken';

const validarJWT = async (req, res, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        const { documento_usuario } = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = { documento_usuario };
        next();
    } catch (error) {
        console.error('Error al verificar JWT:', error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }
};

export { validarJWT };
