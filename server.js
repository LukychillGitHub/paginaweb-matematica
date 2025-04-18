const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ✅ MIDDLEWARES (van primero)
app.use(cors());
app.use(express.json()); // 👈 NECESARIO para leer req.body en POST

// ✅ RUTAS
const authRoutes = require('./routes/auth');
const testimoniosRoutes = require('./routes/testimonios');
const clasesRoutes = require('./routes/clases');

app.use('/api', authRoutes);
app.use('/api/testimonios', testimoniosRoutes);
app.use('/api/clases', clasesRoutes); // 👈 ESTO AHORA SÍ FUNCIONA

// ✅ PÚBLICO
app.use(express.static(path.join(__dirname, 'public')));

// ✅ CATCH-ALL
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ INICIO SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
