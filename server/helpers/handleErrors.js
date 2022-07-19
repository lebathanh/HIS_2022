const createError = require('http-errors')
const logEvents = require('./logEvents')

const handleErrors = function (app) {
  app.use((req, res, next) => {
    next(createError.NotFound('This api does not exist.'))
  })

  app.use((err, req, res, next) => {
    logEvents(`${req.method} ${req.url} : ${err.status} ${err.message}`)
    res.json({
      status: err.status || 500,
      message: err.message,
    })
  })
}

module.exports = handleErrors
