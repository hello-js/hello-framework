'use strict'

const Hello = require('hello')

class HealthchecksController extends Hello.Controller {
  ping (ctx) {
    ctx.status = 200
    ctx.body = 'pong'
  }
}

module.exports = HealthchecksController
