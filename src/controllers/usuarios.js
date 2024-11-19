// import Usuario from '../models/usuarios.js';
import bcrypt from 'bcryptjs';
import { request, response } from 'express';
import { createUsuario as createUser, findUserByEmail, findUserByDocument, updateUsuarioEstado, getPaginatedUsuarios, getUsuarioById , updateUsuarioById, checkCorreoExists, updateAdminById  } from '../models/usuarios.js';


const getUsuarios = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;

    try {
        // Obtener el total y los usuarios paginados
        const { total, usuarios } = await getPaginatedUsuarios(Number(limite), Number(desde));

        res.json({
            total,
            usuarios
        });
    } catch (error) {
        console.error('Error al obtener usuarios paginados:', error);
        res.status(500).json({
            msg: 'Error interno al obtener usuarios'
        });
    }
};

const getUsuario = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const usuario = await getUsuarioById(Number(id));

        if (!usuario) {
            return res.status(404).json({
                msg: 'Usuario no encontrado'
            });
        }

        res.json(usuario);
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({
            msg: 'Error interno al obtener el usuario'
        });
    }
};


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


const deleteUsuario = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const result = await updateUsuarioEstado(id, 2); 
        if (result) {
            res.json({ message: 'Usuario desactivado correctamente' });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al desactivar usuario:', error);
        res.status(500).json({ message: 'Error al desactivar usuario', error });
    }
};

const activateUser = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const result = await updateUsuarioEstado(id, 1); 
        if (result) {
            res.json({ message: 'Usuario activado correctamente' });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al activar usuario:', error);
        res.status(500).json({ message: 'Error al activar usuario', error });
    }
};

const updateUsuarioSinPassword = async (req = request, res = response) => {
    const { id } = req.params;
    const { password_usuario, ...datos } = req.body; // Excluye el campo password_usuario

    try {
        // Verificar si el correo ya existe para otro usuario
        if (datos.correo) {
            const correoEnUso = await checkCorreoExists(datos.correo, id);
            if (correoEnUso) {
                return res.status(400).json({
                    msg: 'El correo ya está en uso por otro usuario'
                });
            }
        }
        
        // Actualizar el usuario en la base de datos
        const resultado = await updateAdminById(id, datos);

        if (resultado) {
            res.json({
                msg: 'Usuario actualizado correctamente',
                usuario: resultado
            });
        } else {
            res.status(404).json({
                msg: 'Usuario no encontrado'
            });
        }
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({
            msg: 'Error interno al actualizar usuario'
        });
    }
};


const updateUsuario = async (req = request, res = response) => {
    const { id } = req.params;
    const { documento_usuario, rol_usuario, tipo_documento, ...resto } = req.body; // Excluir los campos no permitidos

    try {
        // Validar si el correo ya existe en otro usuario
        if (resto.correo) {
            console.log("Ha entrado para actualizarce")
            const correoEnUso = await checkCorreoExists(resto.correo, id);
            if (correoEnUso) {
                return res.status(400).json({
                    msg: 'El correo ya está en uso por otro usuario'
                });
            }
        }

        // Encriptar la contraseña si se envía una nueva
        if (resto.password_usuario) {
            const salt = bcrypt.genSaltSync(10);
            resto.password_usuario = bcrypt.hashSync(resto.password_usuario, salt);
        }

        // Actualizar el usuario en la base de datos
        const resultado = await updateUsuarioById(id, resto);

        if (resultado) {
            res.json({
                msg: 'Usuario actualizado correctamente',
                usuario: resultado
            });
        } else {
            res.status(404).json({
                msg: 'Usuario no encontrado'
            });
        }
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({
            msg: 'Error interno al actualizar usuario'
        });
    }
};


export { createUsuario, deleteUsuario, activateUser, getUsuarios, getUsuario, updateUsuario, updateUsuarioSinPassword  };
