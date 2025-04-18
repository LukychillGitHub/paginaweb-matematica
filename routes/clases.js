const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todas las disponibilidades
router.get('/', (req, res) => {
  db.query('SELECT * FROM disponibilidad', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener la disponibilidad' });
    res.json(results);
  });
});

// Agregar nueva franja horaria
router.post('/', (req, res) => {
  console.log('📥 Body recibido:', req.body); // <-- DEBUG IMPORTANTE

  const { dia_semana, hora_inicio, hora_fin } = req.body;

  if (!dia_semana || !hora_inicio || !hora_fin) {
    return res.status(400).json({ error: 'Faltan datos', body: req.body });
  }

  db.query(
    'INSERT INTO disponibilidad (dia_semana, hora_inicio, hora_fin) VALUES (?, ?, ?)',
    [dia_semana, hora_inicio, hora_fin],
    (err) => {
      if (err) {
        console.error('❌ Error al guardar en la DB:', err);
        return res.status(500).json({ error: 'Error al guardar' });
      }
      res.json({ ok: true });
    }
  );
});

module.exports = router;
