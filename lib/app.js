'use strict'

const Koa = require('koa-plus')

class App extends Koa {
  /**
   * Creates an `App` instance
   *
   * @param {Object} config - Configuration for the app
   * @returns {App} - An `App` instance
   */
  constructor (config = {}) {
    super(config)

    this.context.config = config
  }

}

module.exports = App
