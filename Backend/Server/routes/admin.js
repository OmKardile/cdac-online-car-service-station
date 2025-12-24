const express = require('express')
const pool = require('../utils/db')
const result = require('../utils/result')

const router = express.Router()

router.get('/users', (req, res) => {
  const sql = `SELECT id,firstName,lastName,email,role FROM users`
  pool.query(sql, (err, data) => {
    res.send(result.createResult(err, data))
  })
})

router.get('/bookings', (req, res) => {
  const sql = `SELECT * FROM bookings`
  pool.query(sql, (err, data) => {
    res.send(result.createResult(err, data))
  })
})

router.get('/statistics', (req, res) => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM users) AS users,
      (SELECT COUNT(*) FROM bookings) AS bookings,
      (SELECT IFNULL(SUM(totalPrice),0) FROM bookings) AS revenue
  `
  pool.query(sql, (err, data) => {
    res.send(result.createResult(err, data[0]))
  })
})

module.exports = router
