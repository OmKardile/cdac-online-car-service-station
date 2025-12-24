const express = require('express')
const pool = require('../utils/db')
const result = require('../utils/result')

const router = express.Router()

// Get all users (Admin use)
router.get('/', (req, res) => {
  const sql = `
    SELECT id,firstName,lastName,email,phone,role,isActive
    FROM users
  `
  pool.query(sql, (err, data) => {
    res.send(result.createResult(err, data))
  })
})

// Get user by ID
router.get('/:id', (req, res) => {
  const sql = `
    SELECT id,firstName,lastName,email,phone,role
    FROM users WHERE id=?
  `
  pool.query(sql, [req.params.id], (err, data) => {
    res.send(result.createResult(err, data[0]))
  })
})

// Update user role (Admin)
router.put('/:id/role', (req, res) => {
  const { role } = req.body
  const sql = `UPDATE users SET role=? WHERE id=?`

  pool.query(sql, [role, req.params.id], (err, data) => {
    res.send(result.createResult(err, data))
  })
})

// Activate / Deactivate user
router.put('/:id/status', (req, res) => {
  const { isActive } = req.body
  const sql = `UPDATE users SET isActive=? WHERE id=?`

  pool.query(sql, [isActive, req.params.id], (err, data) => {
    res.send(result.createResult(err, data))
  })
})

module.exports = router
