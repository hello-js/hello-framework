'use strict'

const co = require('co')
const ejs = require('koa-ejs')
const Config = require('./config')
const database = require('./database')
const favicon = require('koa-favicon')
const Koa = require('koa-plus')
const path = require('path')
const serve = require('koa-static')

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

    /**
     * View rendering with ejs
     */
    if (config.views && config.views.enabled) {
      ejs(this, {
        cache: config.views.cache,
        root: config.views.path,
        viewExt: 'ejs',
        layout: 'layouts/application'
      })
      this.context.render = co.wrap(this.context.render)
    }

    /**
     * Public folder, favicon rendering
     */
    if (config.public) {
      this.use(favicon(path.join(config.public, 'favicon.ico')))
      this.use(serve(config.public))
    }
  }
}

module.exports = App
