const express = require('express')
const pool = require('../utils/db')
const result = require('../utils/result')

const router = express.Router()

router.post('/', (req, res) => {
  const uid = req.headers.uid
  const { serviceId, stationId, scheduledDate, vehicleDetails, totalPrice } =
    req.body

  const sql = `
    INSERT INTO bookings
    (userId,serviceId,stationId,scheduledDate,vehicleDetails,totalPrice)
    VALUES (?,?,?,?,?,?)
  `
  pool.query(
    sql,
    [
      uid,
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
})

router.get('/', (req, res) => {
  const uid = req.headers.uid
  const sql = `SELECT * FROM bookings WHERE userId=?`
  pool.query(sql, [uid], (err, data) => {
    res.send(result.createResult(err, data))
  })
})

router.get('/:id', (req, res) => {
  const sql = `SELECT * FROM bookings WHERE id=?`
  pool.query(sql, [req.params.id], (err, data) => {
    res.send(result.createResult(err, data[0]))
  })
})

router.patch('/:id/status', (req, res) => {
  const { status } = req.body
  const sql = `UPDATE bookings SET status=? WHERE id=?`
  pool.query(sql, [status, req.params.id], (err, data) => {
    res.send(result.createResult(err, data))
  })
})

module.exports = router
