'use strict'

const Hello = require('hello')

class HelloTemplate extends Hello.Model {
  /**
   * List the visible attributes when the HelloTemplate model is serialized to JSON via the toJSON method
   *
   * @type {Array}
   */
  get visible () {
    return ['id']
  }

  get hasTimestamps () {
    return true
  }
}

module.exports = Hello.Model.register('HelloTemplate', HelloTemplate)
