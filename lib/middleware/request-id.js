'use strict'

const uuid = require('uuid')

/**
 * Generates a unique request ID for all requests, setting it as `ctx.id`, `ctx.request.id` and
 * `ctx.state.requestId`. It will also set the `X-Request-Id` header to aid clients with debugging.
 *
 * @example
 *   ctx.headers
 *   // { `x-request-id`: '72243aca-e4bb-4a3a-a2e7-ed380c256826' }
 *
 *   ctx.state
 *   // { requestId: '72243aca-e4bb-4a3a-a2e7-ed380c256826' }
 *
 * @returns {Promise}
 */
function requestId (ctx, next) {
  let requestId = uuid.v4()

  ctx.id = requestId
  ctx.request.id = requestId
  ctx.state.requestId = requestId
  ctx.set('X-Request-Id', requestId)

  return next()
}

module.exports = requestId
