'use strict'

function up (knex) {
  return knex.schema.raw('CREATE EXTENSION "pgcrypto";')
}

function down (knex) {
  return knex.schema.raw('DROP EXTENSION IF EXISTS "pgcrypto";')
}

module.exports = {
  up,
  down
}
