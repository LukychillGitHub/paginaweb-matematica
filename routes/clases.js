const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ Obtener todas las disponibilidades
router.get('/', (req, res) => {
  db.query('SELECT * FROM disponibilidad', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener la disponibilidad' });
    res.json(results);
  });
});

// ✅ Agregar nueva franja con fecha exacta
router.post('/', (req, res) => {
  console.log('📥 Body recibido:', req.body);

  const { fecha, hora_inicio, hora_fin } = req.body;

  if (!fecha || !hora_inicio || !hora_fin) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  const querySolapado = `
    SELECT * FROM disponibilidad
    WHERE fecha = ?
    AND (
      ? < hora_fin AND ? > hora_inicio
    )
  `;

  db.query(querySolapado, [fecha, hora_fin, hora_inicio], (err, results) => {
    if (err) {
      console.error('❌ Error al verificar solapamientos:', err);
      return res.status(500).json({ error: 'Error en la validación' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'Ya existe una disponibilidad en ese horario.' });
    }

    db.query(
      'INSERT INTO disponibilidad (fecha, hora_inicio, hora_fin) VALUES (?, ?, ?)',
      [fecha, hora_inicio, hora_fin],
      (err) => {
        if (err) {
          console.error('❌ Error al guardar en la DB:', err);
          return res.status(500).json({ error: 'Error al guardar' });
        }
        res.json({ ok: true });
      }
    );
  });
});

// ✅ Obtener eventos para el calendario (FullCalendar)
router.get('/eventos', (req, res) => {
  db.query('SELECT * FROM disponibilidad', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al cargar eventos' });

    const eventos = results.flatMap(row => {
      const fecha = row.fecha.toISOString().split('T')[0]; // "YYYY-MM-DD"
      const start = `${fecha}T${row.hora_inicio}`;
      const end = `${fecha}T${row.hora_fin}`;

      return [
        {
          title: 'Disponible',
          start,
          end,
          display: 'auto',       // visible como texto (vista mensual)
          color: '#90ee90'
        },
        {
          title: 'Disponible',
          start,
          end,
          display: 'background', // visible como fondo (vista semanal/día)
          color: '#90ee90'
        }
      ];
    });

    console.log('📤 Eventos enviados al calendario:', eventos);
    res.json(eventos);
  });
});

// ✅ Eliminar una disponibilidad
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM disponibilidad WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar' });
    res.json({ ok: true });
  });
});

module.exports = router;
