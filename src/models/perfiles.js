import oracledb from 'oracledb';

// Obtiene los permisos de un formulario específico para un rol determinado
const getPermisos = async (rolId, nombreFormulario) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `SELECT p.INSERTAR, p.ACTUALIZAR, p.ELIMINAR
             FROM PERFILES p
             JOIN FORMULARIOS f ON p.ID_FORMULARIO = f.ID_FORMULARIO
             WHERE p.ID_PERFIL = :rolId AND f.NOMBRE_FORMULARIO = :nombreFormulario`,
            { rolId, nombreFormulario },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows.length === 0) {
            return null; // No tiene permisos de lectura
        }

        const permisos = result.rows[0];
        return {
            lectura: true,
            insertar: permisos.INSERTAR === 1,
            actualizar: permisos.ACTUALIZAR === 1,
            eliminar: permisos.ELIMINAR === 1
        };
    } catch (error) {
        console.error('Error al obtener permisos:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

// Obtiene permisos de lectura para un formulario específico y rol de usuario
const getPermisosLectura = async (rolId, nombreFormulario) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `SELECT 1 AS LECTURA
             FROM PERFILES p
             JOIN FORMULARIOS f ON p.ID_FORMULARIO = f.ID_FORMULARIO
             WHERE p.ID_PERFIL = :rolId AND f.NOMBRE_FORMULARIO = :nombreFormulario`,
            { rolId, nombreFormulario },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        // Si hay algún resultado, significa que tiene permiso de lectura
        return result.rows.length > 0;
    } catch (error) {
        console.error('Error al obtener permisos de lectura:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};


const getAllPerfiles = async () => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `SELECT * FROM PERFILES`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    } catch (error) {
        console.error("Error al obtener perfiles:", error);
        throw error;
    } finally {
        if (connection) await connection.close();
    }
};

// Obtener un perfil por ID
const getPerfilById = async (idPerfil, idFormulario) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `SELECT * FROM PERFILES WHERE ID_PERFIL = :idPerfil AND ID_FORMULARIO = :idFormulario`,
            { idPerfil, idFormulario },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows.length ? result.rows[0] : null;
    } catch (error) {
        console.error("Error al obtener perfil por ID:", error);
        throw error;
    } finally {
        if (connection) await connection.close();
    }
};


const createPerfil = async (perfilData) => {
    let connection;
    try {
        const { idPerfil, idFormulario, insertar, actualizar, eliminar } = perfilData;
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `INSERT INTO PERFILES (ID_PERFIL, ID_FORMULARIO, INSERTAR, ACTUALIZAR, ELIMINAR)
             VALUES (:idPerfil, :idFormulario, :insertar, :actualizar, :eliminar)`,
            { idPerfil, idFormulario, insertar, actualizar, eliminar },
            { autoCommit: true }
        );
        return result.rowsAffected > 0;
    } catch (error) {
        console.error("Error al crear perfil:", error);
        throw error;
    } finally {
        if (connection) await connection.close();
    }
};

const updatePerfilById = async (idPerfil, idFormulario, perfilData) => {
    let connection;
    try {
        const { insertar, actualizar, eliminar } = perfilData;
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `UPDATE PERFILES 
             SET INSERTAR = :insertar, ACTUALIZAR = :actualizar, ELIMINAR = :eliminar 
             WHERE ID_PERFIL = :idPerfil AND ID_FORMULARIO = :idFormulario`,
            { idPerfil, idFormulario, insertar, actualizar, eliminar },
            { autoCommit: true }
        );
        return result.rowsAffected > 0;
    } catch (error) {
        console.error("Error al actualizar perfil:", error);
        throw error;
    } finally {
        if (connection) await connection.close();
    }
};

const deletePerfilById = async (idPerfil, idFormulario) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `DELETE FROM PERFILES WHERE ID_PERFIL = :idPerfil AND ID_FORMULARIO = :idFormulario`,
            { idPerfil, idFormulario },
            { autoCommit: true }
        );
        return result.rowsAffected > 0;
    } catch (error) {
        console.error("Error al eliminar perfil:", error);
        throw error;
    } finally {
        if (connection) await connection.close();
    }
};

const getFormattedPerfiles = async () => {
    let connection;
    try {
        connection = await oracledb.getConnection();

        const result = await connection.execute(
            `SELECT 
                p.ID_PERFIL,
                r.rol.nombre AS NOMBRE_ROL,
                p.ID_FORMULARIO,
                f.NOMBRE_FORMULARIO,
                p.INSERTAR,
                p.ACTUALIZAR,
                p.ELIMINAR
             FROM 
                PERFILES p
             JOIN 
                ROLES r ON p.ID_PERFIL = r.rol.id
             JOIN 
                FORMULARIOS f ON p.ID_FORMULARIO = f.ID_FORMULARIO`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        return result.rows;
    } catch (error) {
        console.error('Error al obtener perfiles formateados:', error);
        throw new Error('Error al obtener perfiles');
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

export { getPermisos, getPermisosLectura,getAllPerfiles, getPerfilById,createPerfil, updatePerfilById , deletePerfilById, getFormattedPerfiles  };
