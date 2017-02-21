'use strict'

const expect = require('chai').expect
const Model = require('../../lib/model')

describe('Model', function () {
  describe('#tableName', function () {
    it('defaults to a tableized name of the subclass', function () {
      class User extends Model {}
      class SessionToken extends Model {}
      class Person extends Model {}

      expect(User.forge().tableName).to.equal('users')
      expect(SessionToken.forge().tableName).to.equal('session_tokens')
      expect(Person.forge().tableName).to.equal('people')
    })

    it('uses the schema name, if set on the model', function () {
      class Business extends Model {
        get schemaName () {
          return 'schema'
        }
      }

      expect(Business.forge().tableName).to.equal('schema.businesses')
    })
  })

  describe('#idAttribute', function () {
    it('returns the default `id` attribute on the model', function () {
      class User extends Model {}

      expect(User.forge().idAttribute).to.equal('id')
    })
  })

  describe('.database', function () {
    it('returns the Bookshelf instance', function () {
      class User extends Model {}

      expect(User.database.knex).to.be.defined
    })
  })

  describe('.register', function () {
    it('registers the model in the database registry', function () {
      class User extends Model {}

      Model.register('User', User)

      expect(Model.database.model('User')).to.deep.equal(User)
    })
  })
})
