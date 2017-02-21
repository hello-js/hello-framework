'use strict'

const Knex = require('knex')
const Bookshelf = require('bookshelf')
const bookshelf = new Bookshelf(new Knex({}))
const securePassword = require('bookshelf-secure-password')

bookshelf.plugin('registry')
bookshelf.plugin('virtuals')
bookshelf.plugin('visibility')
bookshelf.plugin('pagination')
bookshelf.plugin(securePassword)

/**
 * Method to initialize a `Knex` instance for the bookshelf instance.
 *
 * @param {Object} knexConfig - the database configuration for Knex
 * @returns {Bookshelf}
 */
bookshelf.connect = function (knexConfig) {
  let oldKnex = this.knex
  this.knex = new Knex(knexConfig)
  oldKnex.destroy()
  return bookshelf
}

module.exports = bookshelf
