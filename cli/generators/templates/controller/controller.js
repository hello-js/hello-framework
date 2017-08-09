'use strict'

const _ = require('lodash')
const Hello = require('hello')

class HelloTemplatesController extends Hello.Controller {
  async index () {
    let helloTemplates = await this.ctx.models.HelloTemplate.query().orderBy('created_at', 'asc')

    this.ctx.body = {
      helloTemplates
    }
  }

  async show () {
    let helloTemplate = await this.ctx.models.HelloTemplate.query().where('id', this.ctx.params.id).first()

    if (!helloTemplate) {
      this.ctx.throw(404)
    }

    this.ctx.body = {
      helloTemplate
    }
  }

  async create () {
    let params = helloTemplateParams(this.ctx)
    let helloTemplate = await this.ctx.models.HelloTemplate.query().insert(params).returning('*')

    this.ctx.status = 201
    this.ctx.body = {
      helloTemplate
    }
  }

  async update () {
    let params = helloTemplateParams(this.ctx)
    let helloTemplate = await this.ctx.models.HelloTemplate.query().patch(params).where('id', this.ctx.params.id).first().returning('*')

    if (!helloTemplate) {
      this.ctx.throw(404)
    }

    this.ctx.body = {
      helloTemplate
    }
  }

  async destroy () {
    await this.ctx.models.HelloTemplate.query().delete().where('id', this.ctx.params.id)

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
