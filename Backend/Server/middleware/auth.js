const jwt = require('jsonwebtoken')
const result = require('../utils/result')
const config = require('../utils/config')

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader)
    return res.send(result.createResult('No token provided'))

  // Works for Postman Authorization tab
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader

  jwt.verify(token, config.SECRET, (err, decoded) => {
    if (err)
      return res.send(result.createResult('Invalid token'))

    req.headers.uid = decoded.uid
    req.headers.role = decoded.role
    next()
  })
}

function isAdmin(req, res, next) {
  if (req.headers.role !== 'admin')
    return res.send(result.createResult('Access denied: Admins only'))

  next()
}

module.exports = {
  authenticate,
  isAdmin
}
