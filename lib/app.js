'use strict'

const _ = require('lodash')
const co = require('co')
const ejs = require('koa-ejs')
const Config = require('./config')
const database = require('./database')
const favicon = require('koa-favicon')
const i18n = require('koa-i18n')
const Koa = require('koa')
const locale = require('koa-locale')
const path = require('path')
const responseTime = require('koa-response-time')
const serve = require('koa-static')

class App extends Koa {
  /**
   * Creates an `App` instance
   *
   * @param {Object} config - Configuration for the app
   * @returns {App} - An `App` instance
   */
  constructor (config) {
    super()

    this.context.config = new Config(_defaults(config))

    /**
     * Add the `responseTime` middleware if is not disabled.
     */
    if (_isEnabled(options.responseTime)) {
      this.use(responseTime())
    }

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

/**
 * Set default values for the `options` param if not set
 *
 * @private
 * @param {Object} [options] - The options to use (optional)
 * @returns {Object} - The options object with default values
 */
function _defaults (options) {
  return defaultsDeep(options, {
    json: {
      pretty: process.env.NODE_ENV === 'development'
    },
    logger: {
      enabled: process.env.NODE_ENV !== 'test',
      format: process.env.NODE_ENV === 'development' ? 'dev' : 'common'
    }
  })
}

/**
 * Determine if a middleware is enabled in the configuration.  Middleware
 * can be disabled by setting the key to false, or by setting key.enabled = false
 *
 * @private
 * @param {String} middleware - The middleware to check if enabled
 * @returns {Boolean} whether the feature is enabled or not
 */
function _isEnabled (middleware) {
  return middleware && !(middleware === false || middleware.enabled === false)
}

module.exports = App
