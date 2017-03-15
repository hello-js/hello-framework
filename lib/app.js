'use strict'

const _ = require('lodash')
const co = require('co')
const ejs = require('koa-ejs')
const Config = require('./config')
const database = require('./database')
const favicon = require('koa-favicon')
const i18n = require('koa-i18n')
const Koa = require('koa-plus')
const locale = require('koa-locale')
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
     * Public folder, favicon rendering
     */
    if (config.public) {
      this.use(favicon(path.join(config.public, 'favicon.ico')))
      this.use(serve(config.public))
    }

    /**
     * Internationalization (i18n)
     */
    if (config.i18n) {
      locale(this)
      this.use(i18n(this, _.defaults(config.i18n, {
        indent: 2,
        extension: '.json'
      })))
    }

    /**
     * View rendering with ejs
     */
    if (config.views && config.views.enabled) {
      ejs(this, {
        cache: config.views.cache,
        root: config.views.root,
        viewExt: 'ejs',
        layout: 'layouts/application'
      })
      this.context.render = co.wrap(this.context.render)
    }
  }
}

module.exports = App
