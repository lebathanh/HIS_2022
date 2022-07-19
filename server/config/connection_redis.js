const redis = require('redis')
const client = redis.createClient({
  port: 6379,
  host: '127.0.0.1',
  legacyMode: true,
})

;(async () => {
  await client.connect()

  client.ping((err, pong) => {
    if (err) console.log(err)
    console.log(`Redis is connected ::: ${pong}`)
  })
})()

module.exports = client
