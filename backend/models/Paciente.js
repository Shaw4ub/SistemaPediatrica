const mogoose = require('mongoose');

const pacienteSchema = new mogoose.Schema({
    nombre: {
        type: String,
        required: true,
    }
});

module.exports = mogoose.model('Paciente', pacienteSchema);