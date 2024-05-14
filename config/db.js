const Pool = require("pg").Pool;

const pool = new Pool({
    user:"postgres",
    password:"priyu2201",
    host:"localhost",
    port:5432,
    database:"ptodo"
})

module.exports = pool;

