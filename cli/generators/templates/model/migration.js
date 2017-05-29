'use strict'

function up (knex) {
  return knex.schema.createTable('hello_templates', function (t) {
    t.uuid('id').primary().defaultsTo(knex.raw('gen_random_uuid()'))

    t.timestamps()
  })
}

function down (knex) {
  return knex.schema.dropTableIfExists('hello_templates')
}

module.exports = {
  up,
  down
}
