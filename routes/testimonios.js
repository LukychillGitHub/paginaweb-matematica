const express = require('express');
const router = express.Router();
const db = require('../db').promise(); // usamos promesas para async/await

// ✅ Obtener testimonios paginados
router.get('/', async (req, res) => {
  try {
    const pagina = parseInt(req.query.page) || 1;
    const testimoniosPorPagina = 3;
    const offset = (pagina - 1) * testimoniosPorPagina;

    console.log(`🔄 Solicitando página ${pagina} | OFFSET: ${offset}`);

    const [results] = await db.query(
      `SELECT nombre, mensaje, DATE_FORMAT(fecha, "%d/%m/%Y") AS fecha
       FROM testimonios
       ORDER BY fecha DESC
       LIMIT ? OFFSET ?`,
      [testimoniosPorPagina, offset]
    );

    res.json(results);
  } catch (err) {
    console.error('❌ Error al obtener testimonios paginados:', err.message);
    res.status(500).json({ error: 'Error al obtener testimonios' });
  }
});

// ✅ Guardar nuevo testimonio
router.post('/', async (req, res) => {
  try {
    const { nombre, mensaje } = req.body;

    if (!nombre || !mensaje) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    await db.query(
      'INSERT INTO testimonios (nombre, mensaje) VALUES (?, ?)',
      [nombre, mensaje]
    );

    console.log(`✅ Testimonio guardado: ${nombre}`);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error al guardar testimonio:', err.message);
    res.status(500).json({ error: 'Error al guardar testimonio' });
  }
});

// ✅ Obtener cantidad total de testimonios
router.get('/cantidad', async (req, res) => {
  try {
    const [result] = await db.query('SELECT COUNT(*) AS cantidad FROM testimonios');
    res.json({ cantidad: result[0].cantidad });
  } catch (err) {
    console.error('❌ Error al contar testimonios:', err.message);
    res.status(500).json({ error: 'Error al contar testimonios' });
  }
});

// ✅ Obtener todos los testimonios (sin paginar)
router.get('/todos', async (req, res) => {
  try {
    const [results] = await db.query(
      'SELECT * FROM testimonios ORDER BY fecha DESC'
    );
    res.json(results);
  } catch (err) {
    console.error('❌ Error al obtener todos los testimonios:', err.message);
    res.status(500).json({ error: 'Error al obtener testimonios' });
  }
});

// ✅ Eliminar testimonio por ID
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await db.query('DELETE FROM testimonios WHERE id = ?', [id]);
    res.sendStatus(200);
  } catch (err) {
    console.error('❌ Error al eliminar testimonio:', err.message);
    res.status(500).json({ error: 'Error al eliminar testimonio' });
  }
});

module.exports = router;
