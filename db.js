const mysql = require('mysql2');

const isProduction = process.env.NODE_ENV === 'production';

const connection = mysql.createConnection({
  host: isProduction ? process.env.MYSQLHOST : process.env.DB_HOST,
  user: isProduction ? process.env.MYSQLUSER : process.env.DB_USER,
  password: isProduction ? process.env.MYSQLPASSWORD : process.env.DB_PASSWORD,
  port: isProduction ? process.env.MYSQLPORT : process.env.DB_PORT,
  database: isProduction ? process.env.MYSQLDATABASE : process.env.DB_NAME
});

connection.connect(err => {
  if (err) {
    console.error('❌ Error de conexión a MySQL:', err.message);
    return;
  }
  console.log('✅ Conectado a MySQL correctamente');
});

module.exports = connection;
