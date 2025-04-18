// db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',            // o el usuario que uses en tu MySQL
  password: '',            // tu contraseña, si tenés
  port: 3307,
  database: 'testimonios_alumnos' // 👈 acá va el nombre de la base que creaste
});

connection.connect(err => {
  if (err) {
    console.error('Error de conexión:', err);
    return;
  }
  console.log('✅ Conectado a MySQL - testimonios_alumnos');
});

module.exports = connection;
