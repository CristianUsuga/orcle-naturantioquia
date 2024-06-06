// src/controllers/usuarios.js
import { createUsuario as createUsuarioModel } from '../models/usuarios.js';
import oracledb from 'oracledb';
import bcrypt from 'bcryptjs';

const createUsuario = async (req, res) => {
    let connection;
    try {
        const { documento_usuario, nombre_usuario, primer_apellido_usuario, segundo_apellido_usuario, correo_usuario, password_usuario, fecha_nacimiento_usuario, telefono_usuario, estado_usuario, sexo_usuario, rol_usuario } = req.body;

        connection = await oracledb.getConnection();

        // Verificar si ya existe un usuario con el mismo correo
        const emailCheckQuery = `SELECT COUNT(*) AS EMAIL_COUNT FROM USUARIOS WHERE CORREO_USUARIO = :correo_usuario`;
        const emailCheckResult = await connection.execute(emailCheckQuery, { correo_usuario });
        
        if (emailCheckResult.rows[0][0] > 0) {
            return res.status(400).json({ message: `Ya existe un usuario con el correo: ${correo_usuario}` });
        }

        // Verificar si ya existe un usuario con el mismo número de documento
        const docCheckQuery = `SELECT COUNT(*) AS DOC_COUNT FROM USUARIOS u WHERE u.documento_usuario.numero= :documento_numero`;
        const docCheckResult = await connection.execute(docCheckQuery, { documento_numero: documento_usuario.numero });
        
        if (docCheckResult.rows[0][0] > 0) {
            return res.status(400).json({ message: `Ya existe un usuario con el número de documento: ${documento_usuario.numero}` });
        }
        console.log("El documento es: "+ documento_usuario.numero)

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password_usuario, salt);
        
        // Crear el usuario en la base de datos
        await createUsuarioModel({ 
            documento_usuario, 
            nombre_usuario, 
            primer_apellido_usuario, 
            segundo_apellido_usuario, 
            correo_usuario, 
            password_usuario: hashedPassword, 
            fecha_nacimiento_usuario, 
            telefono_usuario, 
            estado_usuario, 
            sexo_usuario, 
            rol_usuario 
        });

        res.status(201).json({ message: 'Usuario creado correctamente' });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ message: 'Error al crear usuario contr', error });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error al cerrar la conexión:', err);
            }
        }
    }
};

export { createUsuario };
