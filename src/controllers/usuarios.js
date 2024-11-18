// import Usuario from '../models/usuarios.js';
import bcrypt from 'bcryptjs';
import { createUsuario as createUser, findUserByEmail, findUserByDocument } from '../models/usuarios.js';

const createUsuario = async (req, res) => {
    const { documento_usuario, correo } = req.body;

    try {
        // Verificar si ya existe un usuario con el correo
        const existingEmail = await findUserByEmail(correo);
        if (existingEmail) {
            return res.status(400).json({ message: `Ya existe un usuario con el correo: ${correo}` });
        }

        // Verificar si ya existe un usuario con el documento
        const existingDocument = await findUserByDocument(documento_usuario);
        if (existingDocument) {
            return res.status(400).json({ message: `Ya existe un usuario con el documento: ${documento_usuario}` });
        }

        // Crear usuario
        const result = await createUser(req.body);
        res.status(201).json(result);

    } catch (error) {
        console.error('Error en controlador al crear usuario:', error);
        res.status(500).json({ message: 'Error al crear usuario', error: error.message });
    }
};

export { createUsuario };
