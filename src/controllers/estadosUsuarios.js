import { getAllEstadosUsuarios, getEstadoUsuarioById, createEstadoUsuario, updateEstadoUsuarioNombre, deleteEstadoUsuarioById   } from '../models/estados-usuarios.js';

// Obtener todos los estados de usuario
const obtenerEstadosUsuarios = async (req, res) => {
    try {
        const estados = await getAllEstadosUsuarios();
        res.json(estados);
    } catch (error) {
        console.error('Error al obtener estados de usuario:', error);
        res.status(500).json({ message: 'Error al obtener estados de usuario' });
    }
};

// Obtener un estado de usuario por su ID
const obtenerEstadoUsuarioPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const estado = await getEstadoUsuarioById(id);

        if (!estado) {
            return res.status(404).json({ message: 'Estado de usuario no encontrado' });
        }

        res.json(estado);
    } catch (error) {
        console.error('Error al obtener estado de usuario por ID:', error);
        res.status(500).json({ message: 'Error al obtener estado de usuario por ID' });
    }
};

const crearEstadoUsuario = async (req, res) => {
    const { nombre } = req.body;

    try {
        const estado = await createEstadoUsuario(nombre);

        if (!estado) {
            return res.status(400).json({ message: 'No se pudo crear el estado de usuario' });
        }

        res.status(201).json(estado);
    } catch (error) {
        console.error('Error al crear estado de usuario:', error);
        res.status(500).json({ message: 'Error al crear estado de usuario' });
    }
};

const actualizarEstadoUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;

    try {
        const estadoActualizado = await updateEstadoUsuarioNombre(id, nombre);

        if (!estadoActualizado) {
            return res.status(404).json({ message: 'Estado de usuario no encontrado o no se pudo actualizar' });
        }

        res.status(200).json(estadoActualizado);
    } catch (error) {
        console.error('Error al actualizar estado de usuario:', error);
        res.status(500).json({ message: 'Error al actualizar estado de usuario' });
    }
};

const eliminarEstadoUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        const estadoEliminado = await deleteEstadoUsuarioById(id);

        if (!estadoEliminado) {
            return res.status(404).json({ message: 'Estado de usuario no encontrado o no se pudo eliminar' });
        }

        res.status(200).json(estadoEliminado);
    } catch (error) {
        console.error('Error al eliminar estado de usuario:', error);
        res.status(500).json({ message: 'Error al eliminar estado de usuario' });
    }
};

export { obtenerEstadosUsuarios, obtenerEstadoUsuarioPorId, crearEstadoUsuario, actualizarEstadoUsuario, eliminarEstadoUsuario };
