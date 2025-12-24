const express = require('express')
const app = express()

app.use(express.json())
app.use('/api', require('./routes'))

app.listen(5000, () => {
  console.log('Server running on port 5000')
})
