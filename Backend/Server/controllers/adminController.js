const pool = require('../utils/db')
const result = require('../utils/result')

exports.getUsers = (req, res) => {
  const sql = `SELECT id,firstName,lastName,email,role FROM users`
  pool.query(sql, (err, data) => {
    res.send(result.createResult(err, data))
  })
}

exports.getBookings = (req, res) => {
  const sql = `SELECT * FROM bookings`
  pool.query(sql, (err, data) => {
    res.send(result.createResult(err, data))
  })
}

exports.getStatistics = (req, res) => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM users) AS users,
      (SELECT COUNT(*) FROM bookings) AS bookings,
      (SELECT IFNULL(SUM(totalPrice),0) FROM bookings) AS revenue
  `
  pool.query(sql, (err, data) => {
    res.send(result.createResult(err, data[0]))
  })
}

exports.createStation = (req, res) => {
  const { name, address, phone, email, operatingHours } = req.body

  const sql = `
    INSERT INTO stations (name, address, phone, email, operatingHours)
    VALUES (?, ?, ?, ?, ?)
  `

  pool.query(
    sql,
    [name, address, phone, email, operatingHours],
    (err, data) => {
      res.send(result.createResult(err, data))
    }
  )
}


exports.createService = (req, res) => {
  const { name, description, basePrice, estimatedDuration } = req.body

  const sql = `
    INSERT INTO services (name, description, basePrice, estimatedDuration, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, NOW(), NOW())
  `

  pool.query(
    sql,
    [name, description, basePrice, estimatedDuration],
    (err, data) => {
      if (err) return res.send(result.createResult(err))
      
      // Return the created service with the ID
      const serviceData = {
        id: data.insertId,
        name,
        description,
        basePrice: parseFloat(basePrice),
        estimatedDuration: parseInt(estimatedDuration),
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      res.send(result.createResult(null, serviceData))
    }
  )
}

exports.updateService = (req, res) => {
  const { id, name, description, basePrice, estimatedDuration } = req.body

  if (!id) {
    return res.send(
      result.createResult('Service ID is required')
    )
  }

  const sql = `
    UPDATE services
    SET name = ?, description = ?, basePrice = ?, estimatedDuration = ?
    WHERE id = ?
  `

  pool.query(sql, [name, description, basePrice, estimatedDuration, id], (err, data) => {
    if (err) return res.send(result.createResult(err))
    if (data.affectedRows === 0)
      return res.send(result.createResult('No service found with this ID'))

    const serviceData = {
      id,
      name,
      description,
      basePrice: parseFloat(basePrice),
      estimatedDuration: parseInt(estimatedDuration),
      isActive: 1
    }
    res.send(result.createResult(null, serviceData))
  })
}


exports.addServiceToStation = (req, res) => {
  const { stationId, serviceId, price } = req.body

  const sql = `
    INSERT INTO station_service_prices (stationId, serviceId, price)
    VALUES (?, ?, ?)
  `

  pool.query(
    sql,
    [stationId, serviceId, price],
    (err, data) => {
      res.send(result.createResult(err, data))
    }
  )
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


