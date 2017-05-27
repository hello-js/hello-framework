'use strict'

const app = require('./app')
const config = app.context.config

app.listen(config.port, () => {
  app.logger.info(`HelloRawTemplate server (${config.env}) listening on port ${config.port}`)
  app.logger.info(`available at http://localhost:${config.port}/`)
})
