const path = require('path')
const Postgrator = require('postgrator')
const { getConfig } = require('./db')

function runMigration() {
  const config = getConfig()
  console.log(config)
  const postgrator = new Postgrator({
    migrationDirectory: path.join(__dirname, '/migrations'),
    driver: 'pg',
    host: config.host,
    port: config.port,
    database: config.database,
    username: config.user,
    password: config.password,
    schemaTable: 'schemaversion',
    ssl: true,
  })

  // Migrate to specific version
  postgrator
    .migrate()
    .then(console.log)
    .catch(console.log)
}

runMigration()
