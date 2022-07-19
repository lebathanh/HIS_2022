const fs = require('fs').promises
const path = require('path')
const { format } = require('date-fns')

const fileName = path.join(__dirname, '../logs', `${format(new Date(), 'dd-MM-yyyy')}.log`)
const logEvents = async (msg) => {
  const timeLog = `${format(new Date(), 'HH:mm:ss')}`
  const contentLog = `${timeLog} ${msg}\n`
  try {
    fs.appendFile(fileName, contentLog)
  } catch (error) {
    console.log(error)
  }
}

module.exports = logEvents
