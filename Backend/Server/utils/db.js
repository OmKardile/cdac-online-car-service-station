const mysql = require('mysql2')

const pool = mysql.createPool({
  host: 'localhost',
  user: 'w3-93109',
  password: 'omkarkar',
  database: 'car_service_station_database'
})

module.exports = pool
