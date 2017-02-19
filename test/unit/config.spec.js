'use strict'

const Config = require('../../lib/config')
const expect = require('chai').expect
const path = require('path')

describe('Config', function () {
  let config

  beforeEach(function () {
    config = new Config().load(path.join(__dirname, '..', 'fixtures', 'config'))
  })

  describe('constructor', function () {
    it('allows being given no configuration', function () {
      let config2 = new Config()

      expect(config2.defaultConfig).to.deep.equal({})
      expect(config2.environmentConfig).to.deep.equal({})
      expect(config2.localConfig).to.deep.equal({})
    })

    it('allows being passed a default configuration', function () {
      let config2 = new Config({ some: 'setting' })

      expect(config2.defaultConfig).to.deep.equal({ some: 'setting' })
      expect(config2.environmentConfig).to.deep.equal({})
      expect(config2.localConfig).to.deep.equal({})
    })

    it('allows being passed an existing Config instance', function () {
      let config2 = new Config(config)

      expect(config2.toJSON()).to.deep.equal(config.toJSON())
    })
  })

  describe('#get()', function () {
    it('returns the value at a given key path', function () {
      expect(config.get('objects.local')).to.be.true
    })
  })

  describe('#set()', function () {
    it('sets new values', function () {
      config.set('newValue', 2)

      expect(config.get('newValue')).to.equal(2)
    })

    it('overwrites existing values at keypaths', function () {
      config.set('objects.local', 'overwritten')

      expect(config.get('objects.local')).to.equal('overwritten')
    })
  })

  describe('#env', function () {
    it('returns the environment name', function () {
      expect(config.env).to.equal('test')
    })

    it('falls back to `development` if no environment is set', function () {
      let oldEnv = process.env.NODE_ENV
      delete process.env.NODE_ENV

      expect(config.env).to.equal('development')

      process.env.NODE_ENV = oldEnv
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

  describe('#customConfig', function () {
    it('returns the configuration that was set using the Config class setter', function () {
      expect(config.customConfig).to.deep.equal({})

      config.set('newValue', 3)

      expect(config.customConfig).to.deep.equal({
        newValue: 3
      })
    })
  })

  describe('.load()', function () {
    it('creates a new Config object and calls the `load` instance method', function () {
      let config2 = Config.load(path.join(__dirname, '..', 'fixtures', 'config'))

      expect(config.toJSON()).to.deep.equal(config2.toJSON())
    })
  })

  describe('#load()', function () {
    it('safely handles being given an invalid config directory', function () {
      let badConfig = new Config().load(path.join(__dirname, '..', 'fixtures', 'bad-config'))

      expect(badConfig.defaultConfig).to.deep.equal({})
      expect(badConfig.environmentConfig).to.deep.equal({})
      expect(badConfig.localConfig).to.deep.equal({})
      expect(badConfig.toJSON()).to.deep.equal({
        env: 'test'
      })
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
  })
})
