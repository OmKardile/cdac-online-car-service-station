const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const pool = require('../utils/db')
const result = require('../utils/result')
const config = require('../utils/config')

const router = express.Router()

// REGISTER
router.post('/register', (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body

  bcrypt.hash(password, config.SALT_ROUND, (err, hash) => {
    if (err) return res.send(result.createResult(err))

    const sql = `
      INSERT INTO users(firstName,lastName,email,password,phone)
      VALUES (?,?,?,?,?)
    `
    pool.query(sql, [firstName, lastName, email, hash, phone], (err, data) => {
      res.send(result.createResult(err, data))
    })
  })
})


// LOGIN
router.post('/login', (req, res) => {
  const { email, password } = req.body
  const sql = `SELECT * FROM users WHERE email=? AND isActive=1`

  pool.query(sql, [email], (err, data) => {
    if (err) return res.send(result.createResult(err))
    if (data.length === 0)
      return res.send(result.createResult('Invalid Email'))

    bcrypt.compare(password, data[0].password, (err, status) => {
      if (!status)
        return res.send(result.createResult('Invalid Password'))

      const payload = { uid: data[0].id, role: data[0].role }
      const token = jwt.sign(payload, config.SECRET)

      res.send(
        result.createResult(null, {
          token,
          email: data[0].email,
          role: data[0].role
        })
      )
    })
  })
})

// PROFILE
router.get('/profile', (req, res) => {
  const uid = req.headers.uid
  const sql = `SELECT firstName,lastName,email,phone FROM users WHERE id=?`

  pool.query(sql, [uid], (err, data) => {
    res.send(result.createResult(err, data[0]))
  })
})

// UPDATE PROFILE
router.put('/profile', (req, res) => {
  const uid = req.headers.uid
  const { phone } = req.body

  const sql = `UPDATE users SET phone=? WHERE id=?`
  pool.query(sql, [phone, uid], (err, data) => {
    res.send(result.createResult(err, data))
  })
})

module.exports = router
