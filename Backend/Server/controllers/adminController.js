const pool = require('../utils/db')
const result = require('../utils/result')

exports.getUsers = (req, res) => {
  const sql = `SELECT id,firstName,lastName,email,role FROM users`
  pool.query(sql, (err, data) => {
    res.send(result.createResult(err, data))
  })
}

exports.getBookings = (req, res) => {
  const sql = `SELECT * FROM bookings`
  pool.query(sql, (err, data) => {
    res.send(result.createResult(err, data))
  })
}

exports.getStatistics = (req, res) => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM users) AS users,
      (SELECT COUNT(*) FROM bookings) AS bookings,
      (SELECT IFNULL(SUM(totalPrice),0) FROM bookings) AS revenue
  `
  pool.query(sql, (err, data) => {
    res.send(result.createResult(err, data[0]))
  })
}
