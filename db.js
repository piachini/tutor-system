const Pool = require("pg").Pool;

const pool = new Pool(
    {
        user: "postgres",
        host: "localhost",
        database: "tutor_system",
        password: "test",
        port: 5432,
        application_name: 'index',
        timezone: 'Europe/Rome', // Imposta il fuso orario
    }
);

module.exports = pool;