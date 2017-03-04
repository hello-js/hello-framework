'use strict'

const Koa = require('koa-plus')
const Config = require('./config')

class App extends Koa {
  /**
   * Creates an `App` instance
   *
   * @param {Object} config - Configuration for the app
   * @returns {App} - An `App` instance
   */
  constructor (config) {
    let _config = new Config(config)

    super(_config)

    this.context.config = _config
  }

}

module.exports = App
