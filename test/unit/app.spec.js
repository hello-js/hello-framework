'use strict'

const App = require('../../lib/app')
const database = require('../../lib/database')
const expect = require('chai').expect
const fs = require('fs-promise')
const path = require('path')
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

    it('enables static asset serving if given the `public` option', function () {
      const fixturePath = path.join(__dirname, '..', 'fixtures')

      app = new App({
        public: fixturePath
      })

      return fs.readFile(path.join(fixturePath, 'config', 'default.js'), 'utf8').then((expected) => {
        return request(app.listen())
          .get('/config/default.js')
          .expect(200)
          .expect(expected)
      })
    })

    it('enables i18n for the app', function () {
      app = new App({
        i18n: {}
      })

      expect(app.context.getLocaleFromQuery).to.be.a('function')
      expect(app.context.getLocaleFromSubdomain).to.be.a('function')
      expect(app.context.getLocaleFromHeader).to.be.a('function')
      expect(app.context.getLocaleFromCookie).to.be.a('function')
      expect(app.context.getLocaleFromUrl).to.be.a('function')
      expect(app.context.getLocaleFromTLD).to.be.a('function')
    })
  })
})
