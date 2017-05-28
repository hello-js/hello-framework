'use strict'

const config = require('../config')
const Hello = require('hello')
const middleware = require('./middleware')
const models = require('./models')
const router = require('./routes')

const app = new Hello.App(config)

// TODO: Belongs in `hello`?
app.logger = console
app.context.logger = console
app.context.models = models
app.proxy = true

app.use(middleware.errorHandler)

app.use(router.routes())
app.use(router.allowedMethods())

module.exports = app
