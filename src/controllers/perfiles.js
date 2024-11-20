import {
    getAllPerfiles,
    getPerfilById,
    createPerfil,
    updatePerfilById,
    deletePerfilById,
    getFormattedPerfiles 
} from '../models/perfiles.js';

import { getRolesById } from '../models/roles.js';
import { getFormularioById } from '../models/formularios.js';

// Obtener todos los perfiles
const obtenerPerfiles = async (req, res) => {
    try {
        const perfiles = await getAllPerfiles();
        res.json(perfiles);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener perfiles' });
    }
};

// Obtener un perfil por ID
const obtenerPerfilPorId = async (req, res) => {
    const { idPerfil, idFormulario } = req.params;
    try {
        const perfil = await getPerfilById(idPerfil, idFormulario);
        if (!perfil) {
            return res.status(404).json({ message: 'Perfil no encontrado' });
        }
        res.json(perfil);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener perfil' });
    }
};

// Crear un perfil
const crearPerfil = async (req, res) => {
    const { idPerfil, idFormulario, insertar, actualizar, eliminar } = req.body;
    try {
        // Verificar si el perfil y el formulario existen
        const rolExiste = await getRolesById(idPerfil);
        const formularioExiste = await getFormularioById(idFormulario);

        if (!rolExiste) {
            return res.status(404).json({ message: 'El rol especificado no existe' });
        }
        if (!formularioExiste) {
            return res.status(404).json({ message: 'El formulario especificado no existe' });
        }

        // Crear el perfil
        const perfilCreado = await createPerfil({ idPerfil, idFormulario, insertar, actualizar, eliminar });
        res.status(201).json({ message: 'Perfil creado correctamente', perfilCreado });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear perfil' });
    }
};

// Actualizar un perfil por ID
const actualizarPerfil = async (req, res) => {
    const { idPerfil, idFormulario } = req.params;
    const { insertar, actualizar, eliminar } = req.body;
    try {
        const perfilActualizado = await updatePerfilById(idPerfil, idFormulario, { insertar, actualizar, eliminar });
        if (!perfilActualizado) {
            return res.status(404).json({ message: 'Perfil no encontrado' });
        }
        res.json({ message: 'Perfil actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar perfil' });
    }
};

// Eliminar un perfil por ID
const eliminarPerfil = async (req, res) => {
    const { idPerfil, idFormulario } = req.params;
    try {
        const perfilEliminado = await deletePerfilById(idPerfil, idFormulario);
        if (!perfilEliminado) {
            return res.status(404).json({ message: 'Perfil no encontrado' });
        }
        res.json({ message: 'Perfil eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar perfil' });
    }
};

const obtenerPerfilesFormateados = async (req, res) => {
    try {
        const perfiles = await getFormattedPerfiles();
        res.json({ perfiles });
    } catch (error) {
        console.error('Error en el controlador al obtener perfiles:', error);
        res.status(500).json({ msg: 'Error al obtener perfiles formateados' });
    }
};

export {
    obtenerPerfiles,
    obtenerPerfilPorId,
    crearPerfil,
    actualizarPerfil,
    eliminarPerfil,
    obtenerPerfilesFormateados
};
