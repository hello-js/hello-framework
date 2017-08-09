'use strict'

const Hello = require('hello')

class HelloTemplate extends Hello.Model {
  /**
   * List the visible attributes when the HelloTemplate model is serialized to JSON via the toJSON method
   *
   * @type {Array}
   */
  static get visible () {
    return ['id']
  }

  /**
   * Include timestamps when creating and updating the model
   */
  static get hasTimestamps () {
    return true
  }
}

module.exports = HelloTemplate
