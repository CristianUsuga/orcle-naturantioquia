import { getAllRoles, getRolesById, createRoles, updateRoles, deleteRolesById    } from '../models/roles.js';

// Obtener todos los roles de usuario
const obtenerRoles = async (req, res) => {
    try {
        const roles = await getAllRoles();
        res.json(roles);
    } catch (error) {
        console.error('Error al obtener roles de usuario:', error);
        res.status(500).json({ message: 'Error al obtener roles de usuario' });
    }
};


// Obtener un rol de usuario por su ID
const obtenerRolPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const rol = await getRolesById(id);

        if (!rol) {
            return res.status(404).json({ message: 'rol de usuario no encontrado' });
        }

        res.json(rol);
    } catch (error) {
        console.error('Error al obtener rol de usuario por ID:', error);
        res.status(500).json({ message: 'Error al obtener rol de usuario por ID' });
    }
};

const crearRol = async (req, res) => {
    const { nombre } = req.body;

    try {
        const rol = await createRoles(nombre);

        if (!rol) {
            return res.status(400).json({ message: 'No se pudo crear el rol de usuario' });
        }

        res.status(201).json(rol);
    } catch (error) {
        console.error('Error al crear rol de usuario:', error);
        res.status(500).json({ message: 'Error al crear rol de usuario' });
    }
};

const actualizarRol = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;

    try {
        const rolActualizado = await updateRoles(id, nombre);

        if (!rolActualizado) {
            return res.status(404).json({ message: 'Rol de usuario no encontrado o no se pudo actualizar' });
        }

        res.status(200).json(rolActualizado);
    } catch (error) {
        console.error('Error al actualizar rol de usuario:', error);
        res.status(500).json({ message: 'Error al actualizar rol de usuario' });
    }
};

const eliminarRol = async (req, res) => {
    const { id } = req.params;

    try {
        const rolEliminado = await deleteRolesById(id);

        if (!rolEliminado) {
            return res.status(404).json({ message: 'Rol de usuario no encontrado o no se pudo eliminar' });
        }

        res.status(200).json(rolEliminado);
    } catch (error) {
        console.error('Error al eliminar rol de usuario:', error);
        res.status(500).json({ message: 'Error al eliminar rol de usuario' });
    }
};

export{ obtenerRoles, obtenerRolPorId, crearRol, actualizarRol, eliminarRol  }