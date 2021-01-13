const mysql = require('mysql2/promise')

const pool = mysql.createPool({
    host: 'mysql.doitnews.co.kr',
    port: 3306,
    user: 'admin',
    password: 'doitnews',
    database: 'doitnews',
    connectionLimit: 10
})

module.exports = pool