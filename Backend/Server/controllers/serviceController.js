const pool = require('../utils/db')
const result = require('../utils/result')

exports.getAll = (req, res) => {
  const sql = `SELECT * FROM services WHERE isActive=1`
  pool.query(sql, (err, data) => {
    res.send(result.createResult(err, data))
  })
}

exports.getById = (req, res) => {
  const sql = `SELECT * FROM services WHERE id=?`
  pool.query(sql, [req.params.id], (err, data) => {
    res.send(result.createResult(err, data[0]))
  })
}

exports.getByStation = (req, res) => {
  const sql = `
    SELECT s.*, p.price
    FROM station_service_prices p
    JOIN services s ON s.id=p.serviceId
    WHERE p.stationId=?
  `
  pool.query(sql, [req.params.stationId], (err, data) => {
    res.send(result.createResult(err, data))
  })
}
