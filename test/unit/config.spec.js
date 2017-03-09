'use strict'

const Config = require('../../lib/config')
const expect = require('chai').expect
const path = require('path')

describe('Config', function () {
  let fixture = path.join(__dirname, '..', 'fixtures', 'config')

  describe('constructor', function () {
    it('allows being given no configuration', function () {
      let config = new Config()

      expect(config).to.eql({})
    })

    it('allows being passed a default configuration', function () {
      let config = new Config({ some: 'setting' })

      expect(config).to.eql({
        some: 'setting'
      })
    })

    it('allows being passed an existing Config instance', function () {
      let config = Config.load(fixture)
      let config2 = new Config(config)

      expect(config2).to.eql(config)
    })
  })

  describe('.load()', function () {
    let config

    it('loads all of the appropriate config files from the directory', function () {
      config = Config.load(fixture)

      expect(config).to.eql({
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

    it('safely handles being given an invalid config directory', function () {
      let badConfig = Config.load(path.join(__dirname, '..', 'fixtures', 'bad-config'))

      expect(badConfig).to.eql({
        env: 'test'
      })
    })

    it('defaults to loading the `development` environment if no NODE_ENV is set', function () {
      let env = process.env.NODE_ENV
      delete process.env.NODE_ENV
      let config = Config.load(fixture)

      expect(config.env).to.equal('development')

      process.env.NODE_ENV = env
    })
  })

  describe('#get()', function () {
    let config

    beforeEach(function () {
      config = Config.load(fixture)
    })

    it('returns the value at a given key path', function () {
      expect(config.get('objects.local')).to.equal(true)
    })

    it('returns undefined if the value is not defined', function () {
      expect(config.get('some.where.over.the.rainbow')).to.equal(undefined)
    })
  })

  describe('#set()', function () {
    let config

    beforeEach(function () {
      config = Config.load(fixture)
    })

    it('sets new values', function () {
      config.set('newValue', 2)

      expect(config.get('newValue')).to.equal(2)
    })

    it('overwrites existing values at keypaths', function () {
      config.set('objects.local', 'overwritten')

      expect(config.get('objects.local')).to.equal('overwritten')
    })

    it('allows setting a deep key path that is not defined', function () {
      config.set('some.where.over.the.rainbow', 'abc')

      expect(config.get('some.where.over.the.rainbow')).to.equal('abc')
    })
  })
})
