'use strict'

const Hello = require('hello')
const path = require('path')

let config = Hello.Config.load(path.join(__dirname, 'environments'))

module.exports = config
