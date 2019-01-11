const { Client } = require('pg')

console.log('you require my assistance?')

function getConfig() {
  if (process.env.STAGE === 'local') {
    return {
      host: 'localhost',
      database: 'dexprices-service',
      user: 'postgres',
      password: 'example',
      port: 5432,
    }
  }
  console.log('environment not yet supported!')
  return null
}
async function initDb() {
  const client = new Client(getConfig())
  await client.connect()
  return client
}

module.exports = {
  initDb,
  getConfig,
}
