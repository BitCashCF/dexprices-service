const { Client } = require('pg')
const Postgrator = require('postgrator')

function getConfig() {
  if (process.env.STAGE === 'local') {
    return {
      host: 'localhost',
      database: 'postgres',
      user: 'postgres',
      password: 'example',
      port: 5432,
    }
  } else {
    console.log('environment not yet supported!')
    return null
  }
}

async function initDb() {
  const client = new Client(getConfig())
  await client.connect()
  return client
}

function runMigration() {
  const config = getConfig()
  const postgrator = new Postgrator({
    migrationDirectory: __dirname + '/migrations',
    driver: 'pg',
    host: config.host,
    port: config.port,
    database: config.database,
    username: config.user,
    password: config.password,
    schemaTable: 'schemaversion'
  })

  // Migrate to specific version
  postgrator
    .migrate()
    .then(console.log)
    .catch(console.log)
}

runMigration()