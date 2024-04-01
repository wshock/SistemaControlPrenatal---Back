// Se importa modulo de mysql2/promise para poder usar async y await
const mysql = require("mysql2/promise");

// dotenv para configurar variables de entorno (datos para conexión a la BD)
const dotenv = require("dotenv");
dotenv.config();

// crear conexión a la BD con los datos de .env
const connection = mysql.createConnection({
    host: process.env.host,
    database: process.env.database,
    user: process.env.user,
    password: process.env.password,
})

// exportar método para poder usarlo en diferentes partes del backend
const getConnection = async () => await connection;

module.exports = {
    getConnection
}
