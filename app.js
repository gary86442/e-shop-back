if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const routes = require('./routes')
const app = express()

const port = process.env.PORT || 8080
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(routes)
app.listen(port, () => {
  console.log(`server start on http://localhost:${port}`)
})
