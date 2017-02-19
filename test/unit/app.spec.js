'use strict'

const App = require('../../lib/app')
const request = require('supertest')

describe('App', function () {
  describe('constructor', function () {
    it('creates a new app instance', function () {
      let app = new App()

      return request(app.listen())
        .get('/')
        .expect(404)
    })
  })
})
