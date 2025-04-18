// routes/auth.js
const express = require('express');
const router = express.Router();

// Usuario y contraseña válidos
const USUARIO_ADMIN = 'admin';
const CONTRASENA_ADMIN = process.env.ADMIN_PASSWORD || 'adminYanina';

// POST /api/login
router.post('/login', (req, res) => {
  const { usuario, password } = req.body;

  console.log('🔐 Intento de login recibido:', { usuario, password });

  if (usuario === USUARIO_ADMIN && password === CONTRASENA_ADMIN) {
    return res.json({ ok: true });
  } else {
    return res.status(401).json({ ok: false, error: 'Credenciales inválidas' });
  }
});

module.exports = router;
