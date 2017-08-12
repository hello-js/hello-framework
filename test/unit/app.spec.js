'use strict'

const App = require('../../lib/app')
const controller = require('../support/controller')
const etag = require('etag')
const expect = require('chai').expect
const fs = require('fs-extra')
const Model = require('../../lib/model')
const path = require('path')
const request = require('supertest')
const sinon = require('sinon')
const uuid = require('../support/uuid')

describe('App', function () {
  let origin = 'http://test.host'

  describe('constructor', function () {
    let app

    it('creates a new app instance', function () {
      app = new App()

      return request(app.listen())
        .get('/')
        .expect(404)
    })

    it('adds all documented middleware by default', function () {
      let app = new App()
      app.use(controller)

      return request(app.listen())
        .get('/')
        .set('Origin', origin)
        .expect('X-Response-Time', /^[0-9]+ms$/)
        .expect('X-Request-Id', uuid.regexp)
        .expect('X-Dns-Prefetch-Control', 'off')
        .expect('X-Frame-Options', 'SAMEORIGIN')
        .expect('X-Download-Options', 'noopen')
        .expect('X-Content-Type-Options', 'nosniff')
        .expect('X-XSS-Protection', '1; mode=block')
        .expect('Access-Control-Allow-Origin', origin)
        .expect('Vary', 'Origin, Accept-Encoding')
        .expect('ETag', /.*/)
        .expect(200)
    })

    it('allows configuration of the middleware', function () {
      let app = new App({
        compress: {
          threshold: 1
        },
        cors: {
          origin: '*'
        },
        helmet: {
          noCache: true
        },
        logger: {
          enabled: true,
          skip: () => true
        }
      })
      app.use(controller)

      return request(app.listen())
        .get('/')
        .set('Origin', origin)
        .expect('Surrogate-Control', 'no-store')
        .expect('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
        .expect('Pragma', 'no-cache')
        .expect('Expires', '0')
        .expect('Access-Control-Allow-Origin', '*')
        .expect('Content-Encoding', 'gzip')
        .expect('Transfer-Encoding', 'chunked')
        .expect(200)
    })

    it('parses JSON bodies', function () {
      let app = new App()
      app.use(controller)

      return request(app.listen())
        .post('/')
        .send({ super: 'test' })
        .expect(201)
        .expect({ body: { super: 'test' } })
    })

    it('responds with a `304 Not Modified` if a fresh cache exists', function () {
      let body = { hello: 'world' }
      let app = new App()
      app.use((ctx) => {
        ctx.body = body
      })

      return request(app.listen())
        .get('/')
        .set('If-None-Match', etag(JSON.stringify(body)))
        .expect(304)
    })

    it('allows for disabling each of the middleware', function () {
      let app = new App({
        body: false,
        compress: false,
        cors: false,
        etag: false,
        helmet: false,
        json: false,
        logger: false,
        requestId: false,
        responseTime: false
      })
      app.use(controller)

      return request(app.listen())
        .post('/')
        .set('Origin', origin)
        .send({ super: 'test' })
        .expect((res) => {
          let headers = Object.keys(res.headers)

          if (_includes(headers, 'x-response-time')) {
            throw new Error('Should not include header: X-Response-Time')
          }

          if (_includes(headers, 'x-request-id')) {
            throw new Error('Should not include header: X-Request-Id')
          }
          if (_includes(headers, 'x-dns-prefetch-control')) {
            throw new Error('Should not include header: X-DNS-Prefetch-Control')
          }
          if (_includes(headers, 'x-frame-options')) {
            throw new Error('Should not include header: X-Frame-Options')
          }
          if (_includes(headers, 'x-download-options')) {
            throw new Error('Should not include header: X-Download-Options')
          }
          if (_includes(headers, 'x-content-type-options')) {
            throw new Error('Should not include header: X-Content-Type-Options')
          }
          if (_includes(headers, 'x-xss-protection')) {
            throw new Error('Should not include header: X-XSS-Protection')
          }
          if (_includes(headers, 'access-control-allow-origin')) {
            throw new Error('Should not include header: Access-Control-Allow-Origin')
          }
          if (_includes(headers, 'vary')) {
            throw new Error('Should not include header: Vary')
          }
          if (_includes(headers, 'etag')) {
            throw new Error('Should not include header: ETag')
          }

          if (res.body && res.body.fields) {
            throw new Error('Should not have a res.body `fields` property')
          }
        })
        .expect(201)
    })

    it('attempts to connect to the database if given a database config', function () {
      let sandbox = sinon.sandbox.create()
      sandbox.stub(Model, 'knex')

      app = new App({
        db: {
          client: 'sqlite3',
          connection: {
            filename: ':memory:'
          }
        }
      })

      expect(Model.knex.called).to.equal(true)
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
        public: {
          root: fixturePath
        }
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

function _includes (array, value) {
  return array.indexOf(value) !== -1
}
