import oracledb from 'oracledb';

const getAllFormularios = async () => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `SELECT ID_FORMULARIO, NOMBRE_FORMULARIO, NODO_PRINCIPAL, MODULO, ID_PADRE, ORDEN, URL FROM FORMULARIOS`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    } catch (error) {
        console.error('Error al obtener formularios:', error);
        throw new Error('Error al obtener formularios');
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

const getFormularioById = async (id) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `SELECT ID_FORMULARIO, NOMBRE_FORMULARIO, NODO_PRINCIPAL, MODULO, ID_PADRE, ORDEN, URL 
             FROM FORMULARIOS 
             WHERE ID_FORMULARIO = :id`,
            { id },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows.length ? result.rows[0] : null;
    } catch (error) {
        console.error('Error al obtener formulario por ID:', error);
        throw new Error('Error al obtener formulario');
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

const createFormulario = async (data) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const { nombre, nodoPrincipal, modulo, idPadre, orden, url } = data;
        const sql = `
            INSERT INTO FORMULARIOS (NOMBRE_FORMULARIO, NODO_PRINCIPAL, MODULO, ID_PADRE, ORDEN, URL) 
            VALUES (:nombre, :nodoPrincipal, :modulo, :idPadre, :orden, :url)`;
        await connection.execute(sql, { nombre, nodoPrincipal, modulo, idPadre, orden, url }, { autoCommit: true });
        return { message: 'Formulario creado correctamente' };
    } catch (error) {
        console.error('Error al crear formulario:', error);
        throw new Error('Error al crear formulario');
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

const updateFormularioById = async (idFormulario, datos) => {
    let connection;
    try {
        connection = await oracledb.getConnection();

        // Construir los campos dinámicamente basados en los datos proporcionados
        const campos = [];
        const valores = { idFormulario };

        if (datos.nombre) {
            campos.push("NOMBRE_FORMULARIO = :nombre");
            valores.nombre = datos.nombre;
        }
        if (datos.nodoPrincipal !== undefined) {
            campos.push("NODO_PRINCIPAL = :nodoPrincipal");
            valores.nodoPrincipal = datos.nodoPrincipal;
        }
        if (datos.modulo !== undefined) {
            campos.push("MODULO = :modulo");
            valores.modulo = datos.modulo;
        }
        if (datos.idPadre !== undefined) {
            campos.push("ID_PADRE = :idPadre");
            valores.idPadre = datos.idPadre;
        }
        if (datos.orden !== undefined) {
            campos.push("ORDEN = :orden");
            valores.orden = datos.orden;
        }
        if (datos.url) {
            campos.push("URL = :url");
            valores.url = datos.url;
        }

        // Si no se proporcionó ningún campo para actualizar, devolver un error
        if (campos.length === 0) {
            throw new Error("No hay datos para actualizar.");
        }

        // Construir la consulta SQL dinámicamente
        const query = `UPDATE FORMULARIOS SET ${campos.join(", ")} WHERE ID_FORMULARIO = :idFormulario`;

        // Ejecutar la actualización
        const result = await connection.execute(query, valores, { autoCommit: true });

        return result.rowsAffected > 0 ? { idFormulario, ...datos } : null;
    } catch (error) {
        console.error('Error al actualizar formulario:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};


const deleteFormularioById = async (id) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const sql = `DELETE FROM FORMULARIOS WHERE ID_FORMULARIO = :id`;
        await connection.execute(sql, { id }, { autoCommit: true });
        return { message: 'Formulario eliminado correctamente' };
    } catch (error) {
        console.error('Error al eliminar formulario:', error);
        throw new Error('Error al eliminar formulario');
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

export { getAllFormularios, getFormularioById, createFormulario, updateFormularioById, deleteFormularioById };
