import oracledb from 'oracledb';

// Función para obtener todos los estados de usuario
const getAllEstadosUsuarios = async () => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `SELECT es.estado_usuario.id, es.estado_usuario.nombre FROM estados_usuarios es`,
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        return result.rows;
    } catch (error) {
        console.error('Error al obtener todos los estados de usuario:', error);
        throw new Error('Error al obtener todos los estados de usuario');
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

// Función para obtener un estado de usuario por ID
const getEstadoUsuarioById = async (id) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `SELECT es.estado_usuario.id, es.estado_usuario.nombre FROM estados_usuarios es WHERE es.estado_usuario.id = :id`,
            { id },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows.length === 0) return null; // No encontrado

        return result.rows[0];
    } catch (error) {
        console.error('Error al obtener estado de usuario por ID:', error);
        throw new Error('Error al obtener estado de usuario por ID');
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

// Función para crear un nuevo estado de usuario
const createEstadoUsuario = async (nombre) => {
    let connection;
    try {
        connection = await oracledb.getConnection();

        // Insertar un nuevo estado de usuario con el constructor `elemento`
        const sql = `
            INSERT INTO estados_usuarios (estado_usuario)
            VALUES (elemento(1, :nombre))
        `;

        const result = await connection.execute(sql, { nombre }, { autoCommit: true });

        return result.rowsAffected > 0
            ? { nombre, message: 'Estado de usuario creado correctamente' }
            : null;
    } catch (error) {
        console.error('Error al crear estado de usuario:', error);
        throw new Error('Error al crear estado de usuario');
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

// Función para actualizar el nombre de un estado de usuario por su ID
const updateEstadoUsuarioNombre = async (id, nombre) => {
    let connection;
    try {
        connection = await oracledb.getConnection();

        const sql = `
            UPDATE estados_usuarios us
            SET us.estado_usuario.nombre = :nombre
            WHERE us.estado_usuario.id = :id
        `;

        const result = await connection.execute(sql, { id, nombre }, { autoCommit: true });

        return result.rowsAffected > 0
            ? { id, nombre, message: 'Estado de usuario actualizado correctamente' }
            : null;
    } catch (error) {
        console.error('Error al actualizar estado de usuario:', error);
        throw new Error('Error al actualizar estado de usuario');
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

const deleteEstadoUsuarioById = async (id) => {
    let connection;
    try {
        connection = await oracledb.getConnection();

        const sql = `
            DELETE FROM estados_usuarios us
            WHERE us.estado_usuario.id = :id
        `;

        const result = await connection.execute(sql, { id }, { autoCommit: true });

        return result.rowsAffected > 0
            ? { id, message: 'Estado de usuario eliminado correctamente' }
            : null;
    } catch (error) {
        console.error('Error al eliminar estado de usuario:', error);
        throw new Error('Error al eliminar estado de usuario');
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};



export { getAllEstadosUsuarios, getEstadoUsuarioById, createEstadoUsuario, updateEstadoUsuarioNombre, deleteEstadoUsuarioById  };
