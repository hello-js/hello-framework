'use strict'

const Config = require('../../lib/config')
const expect = require('chai').expect
const path = require('path')

describe('Config', function () {
  let config

  before(function () {
    config = new Config(path.join(__dirname, '..', 'fixtures', 'config'))
  })

  describe('#env', function () {
    it('returns the environment name', function () {
      let config = new Config()
      expect(config.env).to.equal('test')
    })
  })

  describe('#defaultConfig', function () {
    it('returns the configuration for the default.js config file', function () {
      let expectedConfig = require(path.join(__dirname, '..', 'fixtures', 'config', 'default.js'))

      expect(config.defaultConfig).to.deep.equal(expectedConfig)
    })
  })

  describe('#environmentConfig', function () {
    it('returns the configuration for the test.js config file', function () {
      let expectedConfig = require(path.join(__dirname, '..', 'fixtures', 'config', 'test.js'))

      expect(config.environmentConfig).to.deep.equal(expectedConfig)
    })
  })

  describe('#localConfig', function () {
    it('returns the configuration for the test.local.js config file', function () {
      let expectedConfig = require(path.join(__dirname, '..', 'fixtures', 'config', 'test.local.js'))

      expect(config.localConfig).to.deep.equal(expectedConfig)
    })
  })

  describe('#toJSON()', function () {
    it('returns the fully-merged configuration object', function () {
      expect(config.toJSON()).to.deep.equal({
        env: 'test',
        file: 'test.local.js',
        local: 'loaded',
        test: 'loaded',
        default: 'loaded',
        arrays: ['local'],
        objects: {
          default: true,
          test: true,
          local: true
        }
      })
    })

    it('returns an empty config when given an invalid config directory', function () {
      let badConfig = new Config(path.join(__dirname, '..', 'fixtures', 'bad-config'))

      expect(badConfig.toJSON()).to.deep.equal({
        env: 'test'
      })
    })
  })
})
