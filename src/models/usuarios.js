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

// Cambia el estado del usuario 
const updateUsuarioEstado = async (documento_usuario, nuevoEstado) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const sql = `
            UPDATE USUARIOS 
            SET estado_usuario = :nuevoEstado 
            WHERE documento_usuario = :documento_usuario
        `;

        const result = await connection.execute(sql, {
            nuevoEstado,
            documento_usuario
        }, { autoCommit: true });

        return result.rowsAffected === 1;
    } catch (error) {
        console.error('Error al actualizar estado del usuario:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

const getUserById = async (documento_usuario) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `SELECT 
                u.DOCUMENTO_USUARIO,
                u.datos_usuario.nombre AS nombre,
                u.datos_usuario.telefono.fijo AS fijo,
                u.datos_usuario.telefono.movil AS celular,
                u.datos_usuario.correo AS correo,
                u.PRIMER_APELLIDO_USUARIO,
                u.SEGUNDO_APELLIDO_USUARIO,
                u.PASSWORD_USUARIO,
                u.FECHA_NACIMIENTO_USUARIO,
                u.TIPO_DOCUMENTO,
                u.ESTADO_USUARIO,
                u.SEXO_USUARIO,
                u.ROL_USUARIO AS rol_usuario
             FROM 
                USUARIOS u
             WHERE 
                u.DOCUMENTO_USUARIO = :documento_usuario`,
            { documento_usuario },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows.length === 0) return null;

        const usuario = result.rows[0];
        return {
            documento_usuario: usuario.DOCUMENTO_USUARIO,
            nombre: usuario.NOMBRE,
            fijo: usuario.FIJO,
            celular: usuario.CELULAR,
            correo: usuario.CORREO,
            primer_apellido_usuario: usuario.PRIMER_APELLIDO_USUARIO,
            segundo_apellido_usuario: usuario.SEGUNDO_APELLIDO_USUARIO,
            password_usuario: usuario.PASSWORD_USUARIO,
            fecha_nacimiento_usuario: usuario.FECHA_NACIMIENTO_USUARIO,
            tipo_documento: usuario.TIPO_DOCUMENTO,
            estado_usuario: usuario.ESTADO_USUARIO,
            sexo_usuario: usuario.SEXO_USUARIO,
            rol_usuario: usuario.ROL_USUARIO
        };

    } catch (error) {
        console.error('Error al obtener usuario por ID:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

const getPaginatedUsuarios = async (limite, desde) => {
    let connection;
    try {
        connection = await oracledb.getConnection();

        // Llamada a la función almacenada `fn_obtener_usuarios` en el paquete `pkg_usuarios`
        const result = await connection.execute(
            `BEGIN :cursor := pkg_usuarios.fn_obtener_usuarios; END;`,
            { cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
        );

        const cursor = result.outBinds.cursor;

        // Convertir el cursor en una lista de objetos
        const usuarios = [];
        let row;
        let rowCount = 0;

        while ((row = await cursor.getRow()) && rowCount < limite + desde) {
            rowCount++;
            if (rowCount > desde) {
                usuarios.push(row);
            }
        }

        // Cerrar el cursor después de procesarlo
        await cursor.close();

        // Obtener el número total de usuarios (sin paginación)
        const total = rowCount;

        return { total, usuarios };
    } catch (error) {
        console.error('Error al obtener usuarios paginados:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

// Obtiene un usuario específico por su DOCUMENTO_USUARIO, incluyendo relaciones foráneas
const getUsuarioById = async (documento_usuario) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `SELECT 
                u.DOCUMENTO_USUARIO,
                u.datos_usuario.nombre AS NOMBRE_USUARIO,
                u.PRIMER_APELLIDO_USUARIO,
                u.SEGUNDO_APELLIDO_USUARIO,
                u.PASSWORD_USUARIO,
                u.FECHA_NACIMIENTO_USUARIO,
                u.datos_usuario.telefono.fijo AS TELEFONO_FIJO,
                u.datos_usuario.telefono.movil AS CELULAR,
                u.datos_usuario.correo AS CORREO,
                td.tipo_documento.nombre AS TIPO_DOCUMENTO,
                eu.estado_usuario.nombre AS ESTADO_USUARIO,
                s.sexo.nombre AS SEXO,
                r.rol.nombre AS ROL
             FROM 
                USUARIOS u
             LEFT JOIN TIPOS_DOCUMENTOS td ON u.TIPO_DOCUMENTO = td.tipo_documento.id
             LEFT JOIN ESTADOS_USUARIOS eu ON u.ESTADO_USUARIO = eu.estado_usuario.id
             LEFT JOIN SEXOS s ON u.SEXO_USUARIO = s.sexo.id
             LEFT JOIN ROLES r ON u.ROL_USUARIO = r.rol.id
             WHERE u.DOCUMENTO_USUARIO = :documento_usuario`,
            { documento_usuario },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        return result.rows.length ? result.rows[0] : null;
    } catch (error) {
        console.error('Error al obtener usuario por ID:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};


// Actualiza los datos permitidos de un usuario por su DOCUMENTO_USUARIO
const updateUsuarioById = async (documento_usuario, datos) => {
    let connection;
    try {
        connection = await oracledb.getConnection();

        // Crear los campos a actualizar dinámicamente
        const campos = [];
        const valores = { documento_usuario };

        if (datos.nombre) {
            campos.push("u.datos_usuario.nombre = :nombre");
            valores.nombre = datos.nombre;
        }
        if (datos.primer_apellido_usuario) {
            campos.push("u.PRIMER_APELLIDO_USUARIO = :primer_apellido_usuario");
            valores.primer_apellido_usuario = datos.primer_apellido_usuario;
        }
        if (datos.segundo_apellido_usuario) {
            campos.push("u.SEGUNDO_APELLIDO_USUARIO = :segundo_apellido_usuario");
            valores.segundo_apellido_usuario = datos.segundo_apellido_usuario;
        }
        if (datos.password_usuario) {
            campos.push("u.PASSWORD_USUARIO = :password_usuario");
            valores.password_usuario = datos.password_usuario;
        }
        if (datos.fecha_nacimiento_usuario) {
            campos.push("u.FECHA_NACIMIENTO_USUARIO = TO_DATE(:fecha_nacimiento_usuario, 'YYYY-MM-DD')");
            valores.fecha_nacimiento_usuario = datos.fecha_nacimiento_usuario;
        }
        if (datos.fijo) {
            campos.push("u.datos_usuario.telefono.fijo = :fijo");
            valores.fijo = datos.fijo;
        }
        if (datos.celular) {
            campos.push("u.datos_usuario.telefono.movil = :celular");
            valores.celular = datos.celular;
        }
        if (datos.correo) {
            campos.push("u.datos_usuario.correo = :correo");
            valores.correo = datos.correo;
        }
        if (datos.estado_usuario) {
            campos.push("u.ESTADO_USUARIO = :estado_usuario");
            valores.estado_usuario = datos.estado_usuario;
        }
        if (datos.sexo_usuario) {
            campos.push("u.SEXO_USUARIO = :sexo_usuario");
            valores.sexo_usuario = datos.sexo_usuario;
        }

        const query = `UPDATE USUARIOS u SET ${campos.join(", ")} WHERE u.DOCUMENTO_USUARIO = :documento_usuario`;

        const result = await connection.execute(query, valores, { autoCommit: true });

        return result.rowsAffected > 0 ? { documento_usuario, ...datos } : null;
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

const updateAdminById = async (documento_usuario, datos) => {
    let connection;
    try {
        connection = await oracledb.getConnection();

        // Crear los campos a actualizar dinámicamente
        const campos = [];
        const valores = { documento_usuario };

        if (datos.nombre) {
            campos.push("u.datos_usuario.nombre = :nombre");
            valores.nombre = datos.nombre;
        }
        if (datos.primer_apellido_usuario) {
            campos.push("u.PRIMER_APELLIDO_USUARIO = :primer_apellido_usuario");
            valores.primer_apellido_usuario = datos.primer_apellido_usuario;
        }
        if (datos.segundo_apellido_usuario) {
            campos.push("u.SEGUNDO_APELLIDO_USUARIO = :segundo_apellido_usuario");
            valores.segundo_apellido_usuario = datos.segundo_apellido_usuario;
        }
        if (datos.fecha_nacimiento_usuario) {
            campos.push("u.FECHA_NACIMIENTO_USUARIO = TO_DATE(:fecha_nacimiento_usuario, 'YYYY-MM-DD')");
            valores.fecha_nacimiento_usuario = datos.fecha_nacimiento_usuario;
        }
        if (datos.fijo) {
            campos.push("u.datos_usuario.telefono.fijo = :fijo");
            valores.fijo = datos.fijo;
        }
        if (datos.celular) {
            campos.push("u.datos_usuario.telefono.movil = :celular");
            valores.celular = datos.celular;
        }
        if (datos.correo) {
            campos.push("u.datos_usuario.correo = :correo");
            valores.correo = datos.correo;
        }
        if (datos.tipo_documento) {
            campos.push("u.TIPO_DOCUMENTO = :tipo_documento");
            valores.tipo_documento = datos.tipo_documento;
        }
        if (datos.estado_usuario) {
            campos.push("u.ESTADO_USUARIO = :estado_usuario");
            valores.estado_usuario = datos.estado_usuario;
        }
        if (datos.sexo_usuario) {
            campos.push("u.SEXO_USUARIO = :sexo_usuario");
            valores.sexo_usuario = datos.sexo_usuario;
        }
        if (datos.rol_usuario) {
            campos.push("u.ROL_USUARIO = :rol_usuario");
            valores.rol_usuario = datos.rol_usuario;
        }

        const query = `UPDATE USUARIOS u SET ${campos.join(", ")} WHERE u.DOCUMENTO_USUARIO = :documento_usuario`;

        const result = await connection.execute(query, valores, { autoCommit: true });

        return result.rowsAffected > 0 ? { documento_usuario, ...datos } : null;
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};
// Verifica si un correo ya está en uso por otro usuario
const checkCorreoExists = async (correo, documento_usuario) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        
        // Subconsulta para verificar si el correo ya está en uso por otro usuario
        const result = await connection.execute(
            `SELECT COUNT(*) AS COUNT
             FROM USUARIOS u
             WHERE u.datos_usuario.correo = :correo AND u.DOCUMENTO_USUARIO != :documento_usuario`,
            { correo, documento_usuario },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        return result.rows[0].COUNT > 0;
    } catch (error) {
        console.error('Error al verificar existencia de correo:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};


export { createUsuario, findUserByEmail, findUserByDocument, findUserByEmailAuth, updateUsuarioEstado, getUserById , getPaginatedUsuarios, getUsuarioById, updateUsuarioById, checkCorreoExists,updateAdminById    };
