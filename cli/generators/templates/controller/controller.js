'use strict'

const _ = require('lodash')
const Hello = require('hello')

class HelloTemplatesController extends Hello.Controller {
  async index (ctx) {
    let helloTemplates = await ctx.models.HelloTemplate.forge().orderBy('created_at', 'asc').fetchAll()

    ctx.body = {
      helloTemplates
    }
  }

  async show (ctx) {
    let helloTemplate = await ctx.models.HelloTemplate.forge({ id: ctx.params.id }).fetch({ require: true })

    ctx.body = {
      helloTemplate
    }
  }

  async create (ctx) {
    let params = helloTemplateParams(ctx)
    let helloTemplate = ctx.models.HelloTemplate.forge(params)

    await helloTemplate.save()

    ctx.status = 201
    ctx.body = {
      helloTemplate
    }
  }

  async update (ctx) {
    let params = helloTemplateParams(ctx)
    let helloTemplate = await ctx.models.HelloTemplate.forge({ id: ctx.params.id }).fetch({ require: true })

    await helloTemplate.update(params)

    ctx.body = {
      helloTemplate
    }
  }

  async destroy (ctx) {
    await ctx.models.HelloTemplate.forge({ id: ctx.params.id }).destroy()

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
