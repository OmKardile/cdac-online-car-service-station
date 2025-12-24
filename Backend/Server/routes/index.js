const express = require('express')

const authRouter = require('./auth')
const serviceRouter = require('./services')
const stationRouter = require('./stations')
const bookingRouter = require('./bookings')
const adminRouter = require('./admin')
const userRouter = require('./users')

const router = express.Router()

router.use('/auth', authRouter)
router.use('/services', serviceRouter)
router.use('/stations', stationRouter)
router.use('/bookings', bookingRouter)
router.use('/admin', adminRouter)
router.use('/users', userRouter)

module.exports = router
