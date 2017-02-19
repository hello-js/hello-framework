'use strict'

const expect = require('chai').expect
const Hello = require('../lib')

describe('Hello Framework', function () {
  it('exports the App', function () {
    expect(Hello.App).to.be.define
  })
})
