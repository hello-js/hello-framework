'use strict'

const expect = require('chai').expect
const Model = require('../../lib/model')

describe('Model', function () {
  describe('.knex', function () {
    it('returns the knex instance', function () {
      class User extends Model {}

      expect(User.knex.name).to.equal('knex')
    })
  })

  describe('#tableName', function () {
    it('defaults to a tableized name of the subclass', function () {
      class User extends Model {}
      class SessionToken extends Model {}
      class Person extends Model {}

      expect(User.tableName).to.equal('users')
      expect(SessionToken.tableName).to.equal('session_tokens')
      expect(Person.tableName).to.equal('people')
    })

    it('uses the schema name, if set on the model', function () {
      class Business extends Model {
        static get schemaName () {
          return 'schema'
        }
      }

      expect(Business.tableName).to.equal('schema.businesses')
    })
  })

  describe('$beforeInsert', function () {
    it('does nothing if hasTimestamps is set to false', async function () {
      class User extends Model {
        static get hasTimestamps () {
          return false
        }
      }

      let user = new User()
      user.$beforeInsert()
      expect(user.created_at).to.equal(undefined)
      expect(user.updated_at).to.equal(undefined)
    })

    it('sets created_at, updated_at if hasTimestamps is set to true', function () {
      class User extends Model {
        static get hasTimestamps () {
          return true
        }
      }

      let user = new User()
      user.$beforeInsert()
      expect(user.created_at).to.be.a('string')
      expect(user.updated_at).to.be.a('string')
    })
  })

  describe('$beforeUpdate', function () {
    it('does nothing if hasTimestamps is set to false', function () {
      class User extends Model {
        static get hasTimestamps () {
          return false
        }
      }

      let user = new User()
      user.$beforeUpdate()
      expect(user.updated_at).to.equal(undefined)
    })

    it('sets updated_at if hasTimestamps is set to true', function () {
      class User extends Model {
        static get hasTimestamps () {
          return true
        }
      }

      let user = new User()
      user.$beforeUpdate()
      expect(user.updated_at).to.be.a('string')
    })
  })
})
