// src/controllers/usuarios.js
import { createUsuario as createUsuarioModel } from '../models/usuarios.js';

const createUsuario = async (req, res) => {
    try {
        const { documento_usuario, nombre_usuario, primer_apellido_usuario, segundo_apellido_usuario, correo_usuario, password_usuario, fecha_nacimiento_usuario, telefono_usuario, estado_usuario, sexo_usuario, rol_usuario } = req.body;

        // Verificar que telefono_usuario tiene las propiedades 'tipo' y 'numero'
        // if (!telefono_usuario || typeof telefono_usuario.tipo === 'undefined' || typeof telefono_usuario.numero === 'undefined') {
        //     return res.status(400).json({ message: 'telefono_usuario debe tener las propiedades tipo y numero' });
        // }
        console.log(documento_usuario);
        await createUsuarioModel({ documento_usuario, nombre_usuario, primer_apellido_usuario, segundo_apellido_usuario, correo_usuario, password_usuario, fecha_nacimiento_usuario,  telefono_usuario, estado_usuario, sexo_usuario, rol_usuario });

        res.status(201).json({ message: 'Usuario creado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear usuario', error });
        
    }
};

export { createUsuario };
