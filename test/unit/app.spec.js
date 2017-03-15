'use strict'

const App = require('../../lib/app')
const database = require('../../lib/database')
const expect = require('chai').expect
const request = require('supertest')
const sinon = require('sinon')

describe('App', function () {
  describe('constructor', function () {
    let app

    it('creates a new app instance', function () {
      app = new App()

      return request(app.listen())
        .get('/')
        .expect(404)
    })

    it('attempts to connect to the database if given a database config', function () {
      let sandbox = sinon.sandbox.create()
      sandbox.stub(database, 'connect')

      app = new App({
        db: {
          client: 'pg',
          connection: 'db-connection-string'
        }
      })

      expect(database.connect.called).to.equal(true)
      sandbox.restore()
    })

    it('adds a `render` method to ctx when views are enabled', function () {
      app = new App({
        views: {
          enabled: true,
          root: __dirname
        }
      })

      expect(app.context.render).to.be.a('function')
    })
  })
})
