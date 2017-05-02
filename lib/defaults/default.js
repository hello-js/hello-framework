'use strict'

module.exports = {
  json: {
    pretty: false
  },
  logger: {
    enabled: true,
    format: 'common'
  },
  public: {
    gzip: true,
    maxage: 31536000 * 1000
  }
}
