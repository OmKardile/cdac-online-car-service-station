const pool = require('../utils/db')
const result = require('../utils/result')

exports.getAll = (req, res) => {
  const sql = `SELECT * FROM stations WHERE isActive=1`
  pool.query(sql, (err, data) => {
    res.send(result.createResult(err, data))
  })
}

exports.getById = (req, res) => {
  const sql = `SELECT * FROM stations WHERE id=?`
  pool.query(sql, [req.params.id], (err, data) => {
    res.send(result.createResult(err, data[0]))
  })
}
