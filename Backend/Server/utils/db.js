const mysql = require('mysql2')

const pool = mysql.createPool({
  host: 'localhost',
  user: 'W3_93113_Tanmay',
  password: 'manager',
  database: 'car_service_database'
})

module.exports = pool
