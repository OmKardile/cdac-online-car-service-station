const pool = require('../utils/db')
const result = require('../utils/result')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.register = (req, res) => {
  const { firstName, lastName, email, password } = req.body
  const hashed = bcrypt.hashSync(password, 10)

  const sql = `
    INSERT INTO users (firstName, lastName, email, password)
    VALUES (?, ?, ?, ?)
  `
  pool.query(sql, [firstName, lastName, email, hashed], (err, data) => {
    res.send(result.createResult(err, data))
  })
}

exports.login = (req, res) => {
  const { email, password } = req.body
  const sql = `SELECT * FROM users WHERE email=? AND isActive=1`

  pool.query(sql, [email], (err, data) => {
    if (err || data.length === 0)
      return res.send(result.createErrorResult('Invalid credentials'))

    const user = data[0]
    if (!bcrypt.compareSync(password, user.password))
      return res.send(result.createErrorResult('Invalid credentials'))

    const token = jwt.sign(
      { uid: user.id, role: user.role },
      'config.SECRET',
      { expiresIn: '1d' }
    )

    res.send(result.createResult(null, { token }))
  })
}

exports.profile = (req, res) => {
  const sql = `SELECT firstName,lastName,email,phone FROM users WHERE id=?`
  pool.query(sql, [req.user.uid], (err, data) => {
    res.send(result.createResult(err, data[0]))
  })
}

exports.updateProfile = (req, res) => {
  const { phone } = req.body
  const sql = `UPDATE users SET phone=? WHERE id=?`
  pool.query(sql, [phone, req.user.uid], (err, data) => {
    res.send(result.createResult(err, data))
  })
}

// Delete a service by ID
exports.deleteService = (req, res) => {
  const { id } = req.body

  if (!id) {
    return res.send(result.createResult('Service ID is required'))
  }

  const sql = `DELETE FROM services WHERE id = ?`

  pool.query(sql, [id], (err, data) => {
    if (err) return res.send(result.createResult(err))

    if (data.affectedRows === 0) {
      return res.send(result.createResult('No service found with this ID'))
    }

    res.send(result.createResult(null, 'Service deleted successfully'))
  })
}

