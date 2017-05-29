'use strict'

const path = require('path')

module.exports = {
  db: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, '..', '..', 'db', 'migrations'),
      tableName: 'hello_migrations'
    },
    pool: {
      min: 2,
      max: 10
    }
  },

  json: {
    pretty: false,
    spaces: 2
  },

  logging: {
    format: 'common'
  },

  port: process.env.PORT || 3000,

  public: {
    root: path.join(__dirname, '..', '..', 'public')
  }
}
