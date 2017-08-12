'use strict'

const _ = require('lodash')
const Hello = require('hello')

class HelloTemplatesController extends Hello.Controller {
  async index (ctx) {
    let helloTemplates = await ctx.models.HelloTemplate.query().orderBy('created_at', 'asc')

    ctx.body = {
      helloTemplates
    }
  }

  async show (ctx) {
    let helloTemplate = await ctx.models.HelloTemplate.query().where('id', ctx.params.id).first()

    if (!helloTemplate) {
      ctx.throw(404)
    }

    ctx.body = {
      helloTemplate
    }
  }

  async create (ctx) {
    let params = helloTemplateParams(ctx)
    let helloTemplate = await ctx.models.HelloTemplate.query().insert(params).returning('*')

    ctx.status = 201
    ctx.body = {
      helloTemplate
    }
  }

  async update (ctx) {
    let params = helloTemplateParams(ctx)
    let helloTemplate = await ctx.models.HelloTemplate.query().patch(params).where('id', ctx.params.id).first().returning('*')

    if (!helloTemplate) {
      ctx.throw(404)
    }

    ctx.body = {
      helloTemplate
    }
  }

  async destroy (ctx) {
    await ctx.models.HelloTemplate.query().delete().where('id', ctx.params.id)

    ctx.status = 204
  }
}

/**
 * @private
 *
 * Safely pluck expected parameters for creating or updating a HelloTemplate instance.
 *
 * @param {Context} ctx - The context
 * @returns {Object} - The parameters for a HelloTemplate object
 */
function helloTemplateParams (ctx) {
  return _.pick(ctx.body.helloTemplate, '')
}

module.exports = HelloTemplatesController
