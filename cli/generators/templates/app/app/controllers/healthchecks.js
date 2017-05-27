'use strict'

const Hello = require('hello')

class HealthchecksController extends Hello.Controller {
  ping () {
    this.ctx.status = 200
    this.ctx.body = 'pong'
  }
}

module.exports = HealthchecksController
