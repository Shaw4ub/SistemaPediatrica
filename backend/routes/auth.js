const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { nombreUsuario, contraseña, rol } = req.body;
        if (!nombreUsuario || !contraseña) {
            return res.status(400).json({ mensaje: 'Usuario y contraseña son requeridos' });
        }
        const existe = await Usuario.findOne({ nombreUsuario: nombreUsuario.trim() });
        if (existe) {
            return res.status(400).json({ mensaje: 'El nombre de usuario ya está registrado' });
        }
        const nuevoUsuario = new Usuario({
            nombreUsuario: nombreUsuario.trim(),
            contraseña,
            rol: rol || 'user'
        });
        await nuevoUsuario.save();
        res.status(201).json({
            mensaje: 'Usuario registrado exitosamente',
            usuario: {
                id: nuevoUsuario._id,
                nombreUsuario: nuevoUsuario.nombreUsuario,
                rol: nuevoUsuario.rol
            }
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al registrar usuario', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { nombreUsuario, contraseña } = req.body;
        const usuario = await Usuario.findOne({ nombreUsuario });
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        const esCoincidente = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!esCoincidente) {
            return res.status(400).json({ mensaje: 'Credenciales inválidas' });
        }
        const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, 'claveSecreta', { expiresIn: '1h' });
        res.json({
            token,
            usuario: {
                id: usuario._id,
                nombreUsuario: usuario.nombreUsuario,
                rol: usuario.rol
            }
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
});

module.exports = router;
