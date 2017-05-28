'use strict'

const controllers = require('./controllers')
const Hello = require('hello')
const router = new Hello.Router()

router.get('/ping', controllers.healthchecks.action('ping'))

module.exports = router
