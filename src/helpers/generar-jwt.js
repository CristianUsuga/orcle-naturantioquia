import jwt from 'jsonwebtoken';

const generarJWT = (documento_usuario) => {
    return new Promise((resolve, reject) => {
        const payload = { documento_usuario };
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '6h' 
        }, (err, token) => {
            if (err) {
                console.error('Error al generar JWT:', err);
                reject('No se pudo generar el token');
            } else {
                resolve(token);
            }
        });
    });
};

export { generarJWT };
