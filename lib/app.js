'use strict'

const _ = require('lodash')
const body = require('koa-body')
const co = require('co')
const ejs = require('koa-ejs')
const compress = require('koa-compress')
const conditional = require('koa-conditional-get')
const Config = require('./config')
const cors = require('kcors')
const database = require('./database')
const defaultsDeep = require('lodash.defaultsdeep')
const etag = require('koa-etag')
const favicon = require('koa-favicon')
const helmet = require('koa-helmet')
const i18n = require('koa-i18n')
const json = require('koa-json')
const Koa = require('koa')
const locale = require('koa-locale')
const logger = require('koa-morgan')
const middleware = require('./middleware')
const path = require('path')
const responseTime = require('koa-response-time')
const serve = require('koa-static')

class App extends Koa {
  /**
   * Creates an `App` instance
   *
   * @param {Object} options - Configuration for the app
   * @returns {App} - An `App` instance
   */
  constructor (options) {
    super()

    let config = new Config(_defaults(options))
    this.context.config = config

    /**
     * Add the `responseTime` middleware via `koa-response-time`
     */
    if (_isEnabled(config.responseTime)) {
      this.use(responseTime())
    }

    /**
     * Add the `morgan` logger if the logger option is enabled via `koa-morgan`
     */
    if (_isEnabled(config.logger)) {
      this.use(logger(config.logger.format, config.logger))
    }

    /**
     * Add the requestId middleware
     */
    if (_isEnabled(config.requestId)) {
      this.use(middleware.requestId)
    }

    /**
     * Add security headers via the `koa-helmet` module
     */
    if (_isEnabled(config.helmet)) {
      this.use(helmet(config.helmet))
    }

    /**
     * Add the CORS middleware via `kcors`
     */
    if (_isEnabled(config.cors)) {
      this.use(cors(config.cors))
    }

    /**
     * Add the gzip middleware via `koa-compress`
     */
    if (_isEnabled(config.compress)) {
      this.use(compress(config.compress))
    }

    /**
     * Add ETag and If-Modified-Since support via `koa-conditional-get`, `koa-etag`
     */
    if (_isEnabled(config.etag)) {
      this.use(conditional())
      this.use(etag())
    }

    /**
     * Enable body parsing via `koa-body`
     */
    if (_isEnabled(config.body)) {
      this.use(body(config.body))
    }

    /**
     * Enable JSON responses via `koa-json`
     */
    if (_isEnabled(config.json)) {
      this.use(json(config.json))
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
 * Set default values for the `config` param if not set
 *
 * @private
 * @param {Object} [config] - The config to use (optional)
 * @returns {Object} - The config object with default values
 */
function _defaults (config) {
  return defaultsDeep(config, {
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
