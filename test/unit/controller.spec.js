'use strict'

const Controller = require('../../lib/controller')
const expect = require('chai').expect

class Subclass extends Controller {
  index () {
    this.ctx.body = 'hello'
  }
}
const ctx = {
  throw: (code) => {
    let err = new Error()
    err.statusCode = code
    throw err
  }
}
const next = function () {}

describe('Controller', function () {
  describe('constructor', function () {
    it('sets ctx, next, and the controller name', function () {
      let controller = new Subclass(ctx, next)

      expect(controller.ctx).to.eql(ctx)
      expect(controller.next).to.eql(next)
      expect(controller.controllerName).to.equal('Subclass')
    })
  })

  describe('.action', function () {
    it('initializes a Controller instance and calls the instance method for the action', function () {
      let action = Subclass.action('index')

      action(ctx, next)

      expect(ctx.body).to.equal('hello')
    })

    it('throws a 501 if the instance method does not exist', function () {
      let action = Subclass.action('doesnt-exist')

      try {
        action(ctx, next)
        throw new Error('Should not have reached here')
      } catch (err) {
        expect(err.statusCode).to.equal(501)
      }
    })
  })

  describe('abstract methods', function () {
    let methods = ['index', 'new', 'show', 'create', 'edit', 'update', 'destroy']
    methods.forEach(function (methodName) {
      describe(`#${methodName}`, function () {
        it('calls `next` immediately because it is expected to be overwritten by a subclass', function () {
          let callCount = 0
          let controller = new Controller(ctx, function () {
            callCount += 1
          })

          controller[methodName]()

          expect(callCount).to.equal(1)
        })
      })
    })
  })
})
