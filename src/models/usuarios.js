import oracledb from 'oracledb';
import bcrypt from 'bcryptjs';

const createUsuario = async (usuarioData) => {
    let connection;
    try {
        const {
            documento_usuario,
            nombre,
            fijo,
            celular,
            correo,
            primer_apellido_usuario,
            segundo_apellido_usuario = null,
            password_usuario,
            fecha_nacimiento_usuario,
            tipo_documento,
            estado_usuario,
            sexo_usuario,
            rol_usuario
        } = usuarioData;

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password_usuario, salt);

        // Conectar a la base de datos
        connection = await oracledb.getConnection();

        // Definir la consulta SQL de inserción
        const sql = `
            INSERT INTO USUARIOS 
            (
                DOCUMENTO_USUARIO,
                datos_usuario,
                PRIMER_APELLIDO_USUARIO,
                SEGUNDO_APELLIDO_USUARIO,
                PASSWORD_USUARIO,
                FECHA_NACIMIENTO_USUARIO,
                TIPO_DOCUMENTO,
                ESTADO_USUARIO,
                SEXO_USUARIO,
                ROL_USUARIO
            ) 
            VALUES 
            (
                :documento_usuario,
                contacto(:nombre, telefonos(:fijo, :celular), :correo),
                :primer_apellido_usuario,
                :segundo_apellido_usuario,
                :password_usuario,
                TO_DATE(:fecha_nacimiento_usuario, 'YYYY-MM-DD'),
                :tipo_documento,
                :estado_usuario,
                :sexo_usuario,
                :rol_usuario
            )
        `;

        // Ejecutar la inserción en la base de datos
        const result = await connection.execute(sql, {
            documento_usuario,
            nombre,
            fijo: fijo || null,  // Usa null si no se proporciona
            celular,
            correo,
            primer_apellido_usuario,
            segundo_apellido_usuario,
            password_usuario: hashedPassword,
            fecha_nacimiento_usuario,
            tipo_documento,
            estado_usuario,
            sexo_usuario,
            rol_usuario
        }, { autoCommit: true });

        return { message: 'Usuario creado correctamente', result };

    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw new Error('Error al crear usuario: ' + error.message);
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};



const findUserByEmail = async (correo) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `SELECT u.datos_usuario.correo FROM USUARIOS u WHERE u.datos_usuario.correo = :correo`, 
            { correo }
        );
        return result.rows.length > 0; // Retorna true si el correo existe
    } catch (error) {
        console.error('Error al verificar correo existente:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

const findUserByDocument = async (documento_usuario) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `SELECT documento_usuario FROM USUARIOS WHERE documento_usuario = :documento_usuario`, 
            { documento_usuario }
        );
        return result.rows.length > 0; // Retorna true si el documento existe
    } catch (error) {
        console.error('Error al verificar documento existente:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};



const findUserByEmailAuth = async (correo) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `SELECT u.documento_usuario, u.datos_usuario.nombre, u.password_usuario AS password, 
                    u.estado_usuario, e.estado_usuario.id AS estado_id, e.estado_usuario.nombre AS estado_nombre 
             FROM USUARIOS u 
             JOIN ESTADOS_USUARIOS e ON u.estado_usuario = e.estado_usuario.id
             WHERE u.datos_usuario.correo = :correo`, 
            { correo },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows.length === 0) return null;

        const usuario = result.rows[0];
        return {
            documento_usuario: usuario.DOCUMENTO_USUARIO,
            nombre: usuario.NOMBRE,
            password: usuario.PASSWORD,
            estado_usuario: {
                id: usuario.ESTADO_ID,
                nombre: usuario.ESTADO_NOMBRE
            }
        };

    } catch (error) {
        console.error('Error al buscar usuario por correo:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};


export { createUsuario, findUserByEmail, findUserByDocument, findUserByEmailAuth };
