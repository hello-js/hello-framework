'use strict'

async function up (knex) {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto";')
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "citext";')
}

async function down (knex) {
  await knex.schema.raw('DROP EXTENSION IF EXISTS "citext";')
  await knex.schema.raw('DROP EXTENSION IF EXISTS "pgcrypto";')
}

module.exports = {
  up,
  down
}
