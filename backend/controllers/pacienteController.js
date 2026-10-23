const Paciente = require('../models/Paciente');

//Funcion para traer todos los pacientes
exports.getPacientes = async (req, res) => {
    try {
        const pacientes = await Paciente.find();
        res.json(pacientes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// controlador para crear un nuevo paciente
exports.addPaciente = async (req, res) => {
    const { nombre } = req.body;
    try {
        const nuevoPaciente = new Paciente({ nombre });
        const pacienteGuardado = await nuevoPaciente.save();
        res.status(201).json(pacienteGuardado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// controlador para actualizar un paciente existente
exports.updatePaciente = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    try {
        const pacienteActualizado = await Paciente.findByIdAndUpdate(id, { nombre }, { new: true });
        if (!pacienteActualizado) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }else{
            res.status(200).json(pacienteActualizado);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// controlador para eliminar un paciente existente
exports.deletePaciente = async (req, res) => {
    const { id } = req.params;
    try {
        const pacienteEliminado = await Paciente.findByIdAndDelete(id);
        if (!pacienteEliminado) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }else{
            res.status(200).json({ message: 'Paciente eliminado' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
