import oracledb from 'oracledb';

// Función para obtener todos los roles
const getAllRoles = async () => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `SELECT es.rol.id, es.rol.nombre FROM roles es`,
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        return result.rows;
    } catch (error) {
        console.error('Error al obtener todos los roles:', error);
        throw new Error('Error al obtener todos los roles');
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

// Función para obtener un rol de usuario por ID
const getRolesById = async (id) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `SELECT es.rol.id, es.rol.nombre FROM roles es WHERE es.rol.id = :id`,
            { id },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows.length === 0) return null; // No encontrado

        return result.rows[0];
    } catch (error) {
        console.error('Error al obtener roles por ID:', error);
        throw new Error('Error al obtener roles por ID');
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

// Función para crear un nuevo roles
const createRoles = async (nombre) => {
    let connection;
    try {
        connection = await oracledb.getConnection();

        // Insertar un nuevo roles con el constructor `elemento`
        const sql = `
            INSERT INTO roles (rol)
            VALUES (elemento(1, :nombre))
        `;

        const result = await connection.execute(sql, { nombre }, { autoCommit: true });

        return result.rowsAffected > 0
            ? { nombre, message: 'roles creado correctamente' }
            : null;
    } catch (error) {
        console.error('Error al crear roles:', error);
        throw new Error('Error al crear roles');
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

// Función para actualizar el nombre de un roles por su ID
const updateRoles = async (id, nombre) => {
    let connection;
    try {
        connection = await oracledb.getConnection();

        const sql = `
            UPDATE roles us
            SET us.rol.nombre = :nombre
            WHERE us.rol.id = :id
        `;

        const result = await connection.execute(sql, { id, nombre }, { autoCommit: true });

        return result.rowsAffected > 0
            ? { id, nombre, message: 'roles actualizado correctamente' }
            : null;
    } catch (error) {
        console.error('Error al actualizar roles:', error);
        throw new Error('Error al actualizar roles');
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

const deleteRolesById = async (id) => {
    let connection;
    try {
        connection = await oracledb.getConnection();

        const sql = `
            DELETE FROM roles us
            WHERE us.rol.id = :id
        `;

        const result = await connection.execute(sql, { id }, { autoCommit: true });

        return result.rowsAffected > 0
            ? { id, message: 'roles eliminado correctamente' }
            : null;
    } catch (error) {
        console.error('Error al eliminar roles:', error);
        throw new Error('Error al eliminar roles');
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};



export { getAllRoles, getRolesById, createRoles, updateRoles, deleteRolesById  };
