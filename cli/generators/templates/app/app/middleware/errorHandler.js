'use strict'

async function errorHandlerMiddleware (ctx, next) {
  try {
    await next()
  } catch (e) {
    ctx.status = e.status || 500
  }
}

module.exports = errorHandlerMiddleware
