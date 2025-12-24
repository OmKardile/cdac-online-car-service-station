const pool = require('../utils/db')
const result = require('../utils/result')

exports.create = (req, res) => {
  const { serviceId, stationId, scheduledDate, vehicleDetails, totalPrice } =
    req.body

  const sql = `
    INSERT INTO bookings
    (userId, serviceId, stationId, scheduledDate, vehicleDetails, totalPrice)
    VALUES (?, ?, ?, ?, ?, ?)
  `
  pool.query(
    sql,
    [
      req.user.uid,
      serviceId,
      stationId,
      scheduledDate,
      JSON.stringify(vehicleDetails),
      totalPrice
    ],
    (err, data) => {
      res.send(result.createResult(err, { bookingId: data?.insertId }))
    }
  )
}

exports.getMyBookings = (req, res) => {
  const sql = `SELECT * FROM bookings WHERE userId=?`
  pool.query(sql, [req.user.uid], (err, data) => {
    res.send(result.createResult(err, data))
  })
}

exports.getById = (req, res) => {
  const sql = `SELECT * FROM bookings WHERE id=?`
  pool.query(sql, [req.params.id], (err, data) => {
    res.send(result.createResult(err, data[0]))
  })
}

exports.updateStatus = (req, res) => {
  const { status } = req.body
  const sql = `UPDATE bookings SET status=? WHERE id=?`
  pool.query(sql, [status, req.params.id], (err, data) => {
    res.send(result.createResult(err, data))
  })
}
