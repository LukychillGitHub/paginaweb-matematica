// db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST, // 👈 Cambia esto por el host de tu base de datos (localhost o IP)
  user: process.env.MYSQLUSER,            // o el usuario que uses en tu MySQL
  password: process.env.MYSQLPASSWORD,            // tu contraseña, si tenés
  port: process.env.MYSQLPORT,
  database: process.env.MYSQLDATABASE // 👈 acá va el nombre de la base que creaste
});

connection.connect(err => {
  if (err) {
    console.error('Error de conexión:', err);
    return;
  }
  console.log('✅ Conectado a MySQL - testimonios_alumnos');
});

module.exports = connection;
