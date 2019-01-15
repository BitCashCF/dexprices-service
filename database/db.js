const { Client } = require('pg')
const AWS = require('aws-sdk')

function getConfig() {
  const PORT = 5432
  const USER = 'dexprices'
  let HOSTNAME = ''
  const DATABASE = 'dexprices'
  const signer = new AWS.RDS.Signer({ region: 'us-east-1' })
  let token = ''

  switch (process.env.STAGE) {
    case 'production':
      break
    case 'sandbox':
      break
    case 'development':
      HOSTNAME = 'serverless-services.c3yynxcbeqcu.us-east-1.rds.amazonaws.com'
      // get the password token
      token = signer.getAuthToken({
        hostname: HOSTNAME,
        port: PORT,
        username: USER,
      })
      return {
        host: HOSTNAME,
        database: DATABASE,
        user: USER,
        password: token,
        port: PORT,
        ssl: true,
      }
    default:
      return {
        host: 'localhost',
        database: 'dexprices-service',
        user: 'postgres',
        password: 'example',
        port: PORT,
      }
  }
  return null
}

async function initDb() {
  const client = new Client(getConfig())
  try {
    await client.connect()
  } catch (err) {
    console.log(err)
  }
  return client
}

module.exports = {
  initDb,
  getConfig,
}
