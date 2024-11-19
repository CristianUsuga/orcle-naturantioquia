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


export { getPermisos, getPermisosLectura };
