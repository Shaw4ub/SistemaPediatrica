const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Conectar a MongoDB
mongoose.connect('mongodb+srv://miltonmartinez364_db_user:aP9ezqPKwg8laefU@cluster0.pniadyn.mongodb.net/sistema-clinica')

//Rutas para autenticacion
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Rutas de la API
const pacienteRoutes = require('./routes/paciente');
app.use('/api/pacientes', pacienteRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Servidor ejecutándose en el puerto ${port}`);
});
