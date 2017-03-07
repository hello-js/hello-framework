'use strict'

const expect = require('chai').expect
const Hello = require('../../lib')

describe('Hello Framework', function () {
  it('exports the App', function () {
    expect(Hello.App).to.be.a('function')
  })

  it('exports the Config', function () {
    expect(Hello.Config).to.be.a('function')
  })

  it('exports the Controller', function () {
    expect(Hello.Controller).to.be.a('function')
  })

  it('exports the Database connection', function () {
    expect(Hello.Database).to.be.an('object')
  })

  it('exports the Model', function () {
    expect(Hello.Model).to.be.a('function')
  })

  it('exports the Router', function () {
    expect(Hello.Router).to.be.a('function')
  })
})
