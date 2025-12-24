const jwt = require('jsonwebtoken')
const result = require('../utils/result')
const config = require('../utils/config')

// Middleware to verify JWT and set req.headers.uid
function authenticate(req, res, next) {
  const token = req.headers.authorization

  if (!token) return res.send(result.createResult('No token provided'))

  jwt.verify(token, config.SECRET, (err, decoded) => {
    if (err) return res.send(result.createResult('Invalid token'))

    // decoded.uid and decoded.role should exist
    req.headers.uid = decoded.uid
    req.headers.role = decoded.role
    next()
  })
}

// Middleware to check if user is admin
function isAdmin(req, res, next) {
  if (req.headers.role !== 'admin')
    return res.send(result.createResult('Access denied: Admins only'))

  next()
}

module.exports = {
  authenticate,
  isAdmin
}
