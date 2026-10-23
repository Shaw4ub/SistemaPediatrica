const express = require('express');
const router = express.Router();
const {getPacientes, addPaciente, updatePaciente, deletePaciente} = require('../controllers/pacienteController');

// Ruta para obtener todos los pacientes
router.get('/', getPacientes);

// Ruta para crear un nuevo paciente
router.post('/', addPaciente);

// Ruta para actualizar un paciente existente
router.put('/:id', updatePaciente);

// Ruta para eliminar un paciente existente
router.delete('/:id', deletePaciente);

module.exports = router;