// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // 👈 Tiene que ir arriba

const app = express(); // 👈 Esto va antes que cualquier uso de "app.use(...)"

// Rutas
const authRoutes = require('./routes/auth');
const testimoniosRoutes = require('./routes/testimonios');

// Middlewares
app.use(cors());
app.use(express.json());

// Archivos públicos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
app.use('/api', authRoutes); // 👈 Primero auth
app.use('/api/testimonios', testimoniosRoutes); // Luego testimonios

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
