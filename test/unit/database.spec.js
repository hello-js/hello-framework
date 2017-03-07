'use strict'

const database = require('../../lib/database')
const expect = require('chai').expect

describe('Database', function () {
  describe('plugins', function () {
    let model

    before(function () {
      model = new database.Model()
    })

    it('enables the registry plugin', function () {
      expect(database.registry).to.be.an('object')
    })

    it('enables the pagination plugin', function () {
      expect(database.Model.fetchPage).to.be.a('function')
    })

    it('enables the virtuals plugin', function () {
      expect(model.outputVirtuals).to.equal(true)
    })

    it('enables the visibility plugin', function () {
      expect(model.visible).not.to.equal(undefined)
      expect(model.hidden).not.to.equal(undefined)
    })

    it('enables the secure-password plugin', function () {
      expect(model.authenticate).to.be.a('function')
    })
  })

  describe('#connect()', function () {
    it('connects to a new database instance via Knex', function () {
      expect(database.knex.client.config).to.deep.equal({ client: 'pg' })
      database.connect({ client: 'mysql' })
      expect(database.knex.client.config).to.deep.equal({ client: 'mysql' })
    })
  })
})
