const pool = require('../utils/db')
const result = require('../utils/result')

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
