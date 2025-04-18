const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ Obtener testimonios paginados
router.get('/', (req, res) => {
  const pagina = parseInt(req.query.page) || 1;
  const testimoniosPorPagina = 3;
  const offset = (pagina - 1) * testimoniosPorPagina;

  console.log(`🔄 Solicitando página ${pagina} | OFFSET: ${offset}`);

  db.query(
    `SELECT nombre, mensaje, DATE_FORMAT(fecha, "%d/%m/%Y") AS fecha 
     FROM testimonios 
     ORDER BY fecha DESC 
     LIMIT ${db.escape(testimoniosPorPagina)} OFFSET ${db.escape(offset)}`,
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
  
});

// ✅ Guardar nuevo testimonio
router.post('/', (req, res) => {
  const { nombre, mensaje } = req.body;

  if (!nombre || !mensaje) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  db.query(
    'INSERT INTO testimonios (nombre, mensaje) VALUES (?, ?)',
    [nombre, mensaje],
    (err) => {
      if (err) {
        console.error('❌ Error al guardar testimonio:', err);
        return res.status(500).json({ error: 'Error al guardar' });
      }

      console.log(`✅ Testimonio guardado: ${nombre}`);
      res.json({ success: true });
    }
  );
});

// ✅ Obtener cantidad total de testimonios
router.get('/cantidad', (req, res) => {
  db.query('SELECT COUNT(*) AS cantidad FROM testimonios', (err, result) => {
    if (err) {
      console.error('❌ Error al contar testimonios:', err);
      return res.status(500).json({ error: 'Error al contar' });
    }
    res.json({ cantidad: result[0].cantidad });
  });
});

router.get('/todos', (req, res) => {
  db.query('SELECT * FROM testimonios ORDER BY fecha DESC', (err, results) => {
    if (err) {
      console.error('Error al obtener testimonios:', err);
      return res.status(500).json({ error: 'Error al obtener testimonios' });
    }
    res.json(results);
  });
});



router.delete('/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM testimonios WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar' });
    res.sendStatus(200);
  });
});

module.exports = router;