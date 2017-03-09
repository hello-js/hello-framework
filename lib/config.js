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
 *
 * All config settings can be accessed directly off of the Config object. There are also helper
 * methods to safely access and set config settings that are deeply nested.
 *
 * @example
 * let config = new Config()
 * // {}
 *
 * config.set('a.b.c', 'd')
 * // {
 * //   a: {
 * //     b: {
 * //       c: 'd'
 * //     }
 * //   }
 * // }
 *
 * config.get('a.b.c')
 * // 'd'
 *
 * config.a.b.c
 * // 'd'
 *
 * config.get('doesnt.exist')
 * // undefined
 *
 * config.doesnt.exist
 * // TypeError: Cannot read property 'exist' of undefined
 */
class Config {
  constructor (config) {
    _.merge(this, config)
  }

  /**
   * Create a new Config object by loading the configuration from a directory of
   * environment-specific config files
   *
   * @example
   * Config.load(path.join('..', 'config', 'environments'))
   *
   * @param {String} environmentDir - The path to the environment-specific config directory
   * @returns {Config} - The updated config object
   */
  static load (environmentDir) {
    let env = process.env.NODE_ENV || 'development'
    let defaultConfig = _safeLoad(path.join(environmentDir, 'default'))
    let envConfig = _safeLoad(path.join(environmentDir, env))
    let localConfig = _safeLoad(path.join(environmentDir, env + '.local'))

    return new Config(_.merge({}, defaultConfig, envConfig, localConfig, {
      env: env
    }))
  }

  /**
   * Helper method to get a config value via a key-path. Allows safely accessing
   * nested values that may not be defined.
   *
   * @example
   * config.get('appName')
   * config.get('logging.json')
   *
   * @param {String} keyPath - The key (or key path) to access
   * @returns {Any} - The config value, if any, otherwise `undefined`
   */
  get (keyPath) {
    return _.get(this, keyPath)
  }

  /**
   * Helper method to set a config value by key-path.
   *
   * @example
   * config.set('appName', 'Hello')
   * config.set('logging.json', 2)
   *
   * @param {String} keyPath - The key (or key path) to set
   * @param {Any} value - The value to set
   * @returns {Any} - The config value
   */
  set (keyPath, value) {
    return _.set(this, keyPath, value)
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
