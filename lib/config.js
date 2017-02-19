'use strict'

try {
  require('dotenv').config({
    silent: true
  })
} catch (e) { }
const _ = require('lodash')
const path = require('path')

/**
 * The environment-specific config loader.
 *
 * It loads the `.env` file first, then loads `default.js`. From there, it will load the config
 * file named after the current environment (e.g. `development.js`), and deep merge that into
 * `default.js`
 *
 * If there is a `*.local.js` file (e.g. `development.local.js`), it will be used for local
 * machine specific config.
 */
class Config {
  /**
   * Create a Config instance
   *
   * @param {Object} [config] - The default configuration object
   */
  constructor (config) {
    this._config = {
      default: config || {},
      environment: {},
      local: {}
    }
  }

  /**
   * Create a new Config object, loading the configuration from the environment-specific
   * config directory
   *
   * @param {String} environmentDir - The path to the environment-specific config directory
   * @returns {Config} - The new config object
   */
  static load (environmentDir) {
    return new Config().load(environmentDir)
  }

  /**
   * Load the configuration from a directory of environment-specific config files
   *
   * @param {String} environmentDir - The path to the environment-specific config directory
   * @returns {Config} - The updated config object
   */
  load (environmentDir) {
    this._config = {
      default: _safeLoad(path.join(environmentDir, 'default')),
      environment: _safeLoad(path.join(environmentDir, this.env)),
      local: _safeLoad(path.join(environmentDir, this.env + '.local'))
    }

    return this
  }

  get env () {
    return process.env.NODE_ENV || 'development'
  }

  get defaultConfig () {
    return this._config.default
  }

  get environmentConfig () {
    return this._config.environment
  }

  get localConfig () {
    return this._config.local
  }

  /**
   * The compiled config
   *
   * @returns {Object} The config
   */
  toJSON () {
    return _.merge({}, this.defaultConfig, this.environmentConfig, this.localConfig, {
      env: this.env
    })
  }
}

/**
 * @private
 *
 * Load a file, handling any errors
 *
 * @returns {Object} the contents of the file, falling back to an empty object
 */
function _safeLoad (file) {
  try {
    return require(file)
  } catch (err) {
    return {}
  }
}

module.exports = Config
