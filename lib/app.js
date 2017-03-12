'use strict'

const Koa = require('koa-plus')
const Config = require('./config')
const database = require('./database')

class App extends Koa {
  /**
   * Creates an `App` instance
   *
   * @param {Object} config - Configuration for the app
   * @returns {App} - An `App` instance
   */
  constructor (config) {
    config = new Config(config)

    super(config)

    this.context.config = config

    /**
     * If we pass in a db connection, attempt to connect to it
     */
    if (config.db) {
      database.connect(config.db)
    }
  }
}

module.exports = App
