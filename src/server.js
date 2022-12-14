require('express-async-errors')
const sqliteConnection = require("./database/sqlite")
const AppError = require('./utils/AppError')
const uploadConfig = require("./configs/upload")
const cors = require("cors")
const express = require('express')
const routes = require('./routes')

sqliteConnection()

const app = express()
app.use(cors())
app.use(express.json())

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER))
app.use(routes)

app.use((error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message
    })
  }
  console.log(error)

  return res.status(500).json({
    status: 'error',
    message: 'internal server error'
  })
})
const port = process.env.PORT || 3333
app.listen(port, () => console.log(`Server is running on port ${port}`))
