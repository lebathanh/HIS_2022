const mongoose = require('mongoose')

function connect() {
  mongoose
    .connect(
      `mongodb+srv://weffty:thanh2208@cluster0.rzzh1.mongodb.net/BHYT?authSource=admin&replicaSet=atlas-i7aa56-shard-0&w=majority&readPreference=primary&retryWrites=true&ssl=true`,
      {
        serverSelectionTimeoutMS: 3000,
      }
    )
    .then((result) => {
      console.log('Database connection Success!')
    })
    .catch((err) => {
      // !Todo
      console.log('Database connection Failed!', err)
    })

  mongoose.connection.on('connected', () => {
    console.log(`Mongodb connected to database!`)
  })

  mongoose.connection.on('error', (err) => {
    // !Todo
    console.log(`Mongodb error: `, err)
  })

  mongoose.connection.on('disconnected', () => {
    console.log(`Mongodb is disconnected!`)
  })

  process.on('SIGINT', async () => {
    await mongoose.connection.close()
    process.exit(0)
  })
}
module.exports = { connect }
