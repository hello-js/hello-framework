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
   * @param {String} environmentDir - The path to the environment-specific config directory
   */
  constructor (environmentDir) {
    this.environmentDir = environmentDir || __dirname
  }

  get env () {
    return process.env.NODE_ENV || 'development'
  }

  get defaultConfig () {
    return _safeLoad(path.join(this.environmentDir, 'default.js'))
  }

  get environmentConfig () {
    return _safeLoad(path.join(this.environmentDir, this.env))
  }

  get localConfig () {
    return _safeLoad(path.join(this.environmentDir, this.env + '.local'))
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
