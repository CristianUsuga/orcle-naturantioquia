// src//models/usuarios.js
import oracledb from 'oracledb';

const createUsuario = async (usuario) => {
    const { documento_usuario, nombre_usuario, primer_apellido_usuario, segundo_apellido_usuario, correo_usuario, password_usuario, fecha_nacimiento_usuario, telefono_usuario, estado_usuario, sexo_usuario, rol_usuario } = usuario;
    let connection;

    try {
        connection = await oracledb.getConnection();

        const result = await connection.execute(
            `INSERT INTO USUARIOS (DOCUMENTO_USUARIO, NOMBRE_USUARIO, PRIMER_APELLIDO_USUARIO, SEGUNDO_APELLIDO_USUARIO, CORREO_USUARIO, PASSWORD_USUARIO, FECHA_NACIMIENTO_USUARIO, TELEFONO_USUARIO, ESTADO_USUARIO, SEXO_USUARIO, ROL_USUARIO)
             VALUES (US_NATURANTIOQUIA.documento(:documento_tipo, :documento_numero), :nombre_usuario, :primer_apellido_usuario, :segundo_apellido_usuario, :correo_usuario, :password_usuario, TO_DATE(:fecha_nacimiento_usuario, 'YYYY-MM-DD HH24:MI:SS'), US_NATURANTIOQUIA.telefono(:telefono_celular, :telefono_fijo), :estado_usuario, :sexo_usuario, :rol_usuario)`,
            {
                documento_tipo: documento_usuario.tipo,
                documento_numero: documento_usuario.numero,
                nombre_usuario,
                primer_apellido_usuario,
                segundo_apellido_usuario,
                correo_usuario,
                password_usuario,
                fecha_nacimiento_usuario,
                telefono_celular: telefono_usuario.celular,
                telefono_fijo: telefono_usuario.fijo,
                estado_usuario,
                sexo_usuario,
                rol_usuario
            },
            { autoCommit: true }
        );

        console.log('Usuario creado:', result);
    } catch (err) {
        console.error('Error al crear usuario controlador:', err);
        throw err;
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
