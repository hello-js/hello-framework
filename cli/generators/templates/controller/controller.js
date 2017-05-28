'use strict'

const _ = require('lodash')
const Hello = require('hello')

class HelloTemplatesController extends Hello.Controller {
  async index () {
    let helloTemplates = await this.ctx.models.HelloTemplate.forge().orderBy('created_at', 'asc').fetchAll()

    this.ctx.body = {
      helloTemplates
    }
  }

  async show () {
    let helloTemplate = await this.ctx.models.HelloTemplate.forge({ id: this.ctx.params.id }).fetch({ require: true })

    this.ctx.body = {
      helloTemplate
    }
  }

  async create () {
    let params = helloTemplateParams(this.ctx)
    let helloTemplate = this.ctx.models.HelloTemplate.forge(params)

    await helloTemplate.save()

    this.ctx.status = 201
    this.ctx.body = {
      helloTemplate
    }
  }

  async update () {
    let params = helloTemplateParams(this.ctx)
    let helloTemplate = await this.ctx.models.HelloTemplate.forge({ id: this.ctx.params.id }).fetch({ require: true })

    await helloTemplate.update(params)

    this.ctx.body = {
      helloTemplate
    }
  }

  async destroy () {
    await this.ctx.models.HelloTemplate.forge({ id: this.ctx.params.id }).destroy()

    this.ctx.status = 204
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
