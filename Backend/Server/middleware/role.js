const result = require('../utils/result')

// Middleware to allow only specific roles
function allowRoles(allowedRoles = []) {
  return function (req, res, next) {
    const role = req.headers.role

    if (!role) return res.send(result.createResult('Role not found'))

    if (!allowedRoles.includes(role)) {
      return res.send(
        result.createResult(`Access denied: Requires role ${allowedRoles.join(', ')}`)
      )
    }

    next()
  }
}

module.exports = {
  allowRoles
}
