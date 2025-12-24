const express = require('express')
const pool = require('../utils/db')
const result = require('../utils/result')

const router = express.Router()

router.get('/', (req, res) => {
  const sql = `SELECT * FROM stations WHERE isActive=1`
  pool.query(sql, (err, data) => {
    res.send(result.createResult(err, data))
  })
})

router.get('/:id', (req, res) => {
  const sql = `SELECT * FROM stations WHERE id=?`
  pool.query(sql, [req.params.id], (err, data) => {
    res.send(result.createResult(err, data[0]))
  })
})

module.exports = router
