import { getAllFormularios, getFormularioById, createFormulario, updateFormularioById, deleteFormularioById } from '../models/formularios.js';

const obtenerFormularios = async (req, res) => {
    try {
        const formularios = await getAllFormularios();
        res.json(formularios);
    } catch (error) {
        console.error('Error al obtener formularios:', error);
        res.status(500).json({ message: 'Error al obtener formularios' });
    }
};

const obtenerFormularioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const formulario = await getFormularioById(id);
        if (!formulario) return res.status(404).json({ message: 'Formulario no encontrado' });
        res.json(formulario);
    } catch (error) {
        console.error('Error al obtener formulario:', error);
        res.status(500).json({ message: 'Error al obtener formulario' });
    }
};

const crearFormulario = async (req, res) => {
    try {
        const result = await createFormulario(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error al crear formulario:', error);
        res.status(500).json({ message: 'Error al crear formulario' });
    }
};

const actualizarFormulario = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await updateFormularioById(id, req.body);
        res.json(result);
    } catch (error) {
        console.error('Error al actualizar formulario:', error);
        res.status(500).json({ message: 'Error al actualizar formulario' });
    }
};

const eliminarFormulario = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteFormularioById(id);
        res.json(result);
    } catch (error) {
        console.error('Error al eliminar formulario:', error);
        res.status(500).json({ message: 'Error al eliminar formulario' });
    }
};

export { obtenerFormularios, obtenerFormularioPorId, crearFormulario, actualizarFormulario, eliminarFormulario };
