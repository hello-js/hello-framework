'use strict'

const Hello = require('hello')

class Template extends Hello.Model {

}

module.exports = Hello.Model.register('Template', Template)
