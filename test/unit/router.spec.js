'use strict'

const _ = require('lodash')
const Controller = require('../../lib/controller')
const Koa = require('koa')
const request = require('supertest')
const Router = require('../../lib/router')

const user1 = {
  id: 1,
  name: 'User 1'
}
const user2 = {
  id: 2,
  name: 'User 2'
}

const ObjectController = {
  index: (ctx) => {
    ctx.body = { users: [user1, user2] }
  },
  new: (ctx) => {
    ctx.body = 'new'
  },
  show: (ctx) => {
    ctx.body = { user: user1 }
  },
  create: (ctx) => {
    ctx.body = { user: user2 }
    ctx.status = 201
  },
  edit: (ctx) => {
    ctx.state.user = user1
    ctx.body = `edit:${JSON.stringify(ctx.params)}`
  },
  update: (ctx) => {
    ctx.body = { user: user1 }
  },
  destroy: (ctx) => {
    ctx.status = 204
  }
}

class ClassController {
  static index (ctx) {
    ctx.body = { users: [user1, user2] }
  }
  static new (ctx) {
    ctx.body = 'new'
  }
  static show (ctx) {
    ctx.body = { user: user1 }
  }
  static create (ctx) {
    ctx.body = { user: user2 }
    ctx.status = 201
  }
  static edit (ctx) {
    ctx.state.user = user1
    ctx.body = `edit:${JSON.stringify(ctx.params)}`
  }
  static update (ctx) {
    ctx.body = { user: user1 }
  }
  static destroy (ctx) {
    ctx.status = 204
  }
}

class HelloController extends Controller {
  index () {
    this.ctx.body = { users: [user1, user2] }
  }
  new () {
    this.ctx.body = 'new'
  }
  show () {
    this.ctx.body = { user: user1 }
  }
  create () {
    this.ctx.body = { user: user2 }
    this.ctx.status = 201
  }
  edit () {
    this.ctx.state.user = user1
    this.ctx.body = `edit:${JSON.stringify(this.ctx.params)}`
  }
  update () {
    this.ctx.body = { user: user1 }
  }
  destroy () {
    this.ctx.status = 204
  }
}

let tests = {
  ObjectController,
  ClassController,
  HelloController
}

describe('Router', function () {
  let app
  let router

  beforeEach(function () {
    app = new Koa()
    router = new Router()
  })

  describe('#resources', function () {
    _.each(tests, (controller, name) => {
      describe(`with a ${name}`, function () {
        describe('defaults', function () {
          beforeEach(function () {
            router.resources('users', controller)

            app.use(router.routes())
          })

          it('handles the GET #index method', function () {
            return request(app.listen())
              .get('/users')
              .expect(200)
              .expect({
                users: [
                  user1,
                  user2
                ]
              })
          })

          it('handles the GET #new method', function () {
            return request(app.listen())
              .get('/users/new')
              .expect(200)
              .expect('new')
          })

          it('handles the GET #show method', function () {
            return request(app.listen())
              .get('/users/1')
              .expect(200)
              .expect({
                user: user1
              })
          })

          it('handles the GET #edit method', function () {
            return request(app.listen())
              .get('/users/1/edit')
              .expect(200)
              .expect('edit:{"id":"1"}')
          })

          it('handles the POST #create method', function () {
            return request(app.listen())
              .post('/users')
              .expect(201)
              .expect({
                user: user2
              })
          })

          it('handles the PUT #update method', function () {
            return request(app.listen())
              .put('/users/1')
              .expect(200)
              .expect({
                user: user1
              })
          })

          it('handles the PATCH #update method', function () {
            return request(app.listen())
              .patch('/users/1')
              .expect(200)
              .expect({
                user: user1
              })
          })

          it('handles the DELETE #destroy method', function () {
            return request(app.listen())
              .del('/users/1')
              .expect(204)
          })
        })

        describe('with middleware', function () {
          class Controller2Class {
            static show (ctx) {
              ctx.status = 200
            }
          }

          let Controller2Object = {
            show: (ctx) => {
              ctx.status = 200
            }
          }

          let controllers = [Controller2Object, Controller2Class]

          let middleware = function (ctx, next) {
            ctx.body = 'Middleware'
            return next()
          }

          let middleware2 = function (ctx, next) {
            ctx.body = ctx.body + '2'
            return next()
          }

          controllers.forEach((controller2, i) => {
            describe(`with a ${i === 0 ? 'object' : 'class'} controller`, function () {
              it('includes the middleware', function () {
                router.resources('users', middleware, controller2)
                app.use(router.routes())

                return request(app.listen())
                  .get('/users/1')
                  .expect(200)
                  .expect('Middleware')
              })

              it('handles middleware with options', function () {
                router.resources('users', middleware, controller2, { only: ['show'] })
                app.use(router.routes())

                return request(app.listen())
                  .get('/users/1')
                  .expect(200)
                  .expect('Middleware')
              })

              it('handles multiple middleware', function () {
                router.resources('users', middleware, middleware2, controller2, { only: ['show'] })
                app.use(router.routes())

                return request(app.listen())
                  .get('/users/1')
                  .expect(200)
                  .expect('Middleware2')
              })
            })
          })
        })

        describe('with missing controller methods', function () {
          it('treats undefined routes on the controller with 501', function () {
            router.resources('users', _.omit(controller, 'show'))
            app.use(router.routes())

            return request(app.listen())
              .get('/users/1')
              .expect(501)
          })
        })

        describe('with a leading slash', function () {
          it('properly handles the routes', function () {
            router.resources('/users', controller, { only: ['new'] })
            app.use(router.routes())

            return request(app.listen())
              .get('/users/new')
              .expect(200)
              .expect('new')
          })
        })

        describe('using the `only` option', function () {
          beforeEach(function () {
            class Controller {
              static show (ctx) {
                ctx.status = 200
              }

              static index (ctx) {
                ctx.status = 200
              }
            }

            router.resources('users', Controller, { only: 'show' })
            app.use(router.routes())
          })

          it('handles the `only` route', function () {
            return request(app.listen())
              .get('/users/1')
              .expect(200)
          })

          it('treats other routes excluded via the `only` option with a 404', function () {
            return request(app.listen())
              .get('/users')
              .expect(404)
          })
        })

        describe('using the `except` option', function () {
          beforeEach(function () {
            router.resources('users', controller, { except: ['index', 'create', 'update', 'destroy'] })
            app.use(router.routes())
          })

          it('handles the routes not excluded by the `except` option', function () {
            return request(app.listen())
              .get('/users/1')
              .expect(200)
          })

          it('treats other routes in the `except` option with a 404', function () {
            return request(app.listen())
              .get('/users')
              .expect(404)
          })
        })

        describe('using the `param` option', function () {
          beforeEach(function () {
            router.resources('users', controller, { param: 'uuid' })
            app.use(router.routes())
          })

          it('handles the param name', function () {
            return request(app.listen())
              .get('/users/1/edit')
              .expect(200)
              .expect('edit:{"uuid":"1"}')
          })
        })

        describe('using the `api` option', function () {
          beforeEach(function () {
            router.resources('users', controller, { api: true })
            app.use(router.routes())
          })

          it('handles the api-specific', function () {
            return request(app.listen())
              .get('/users/1')
              .expect(200)
          })

          it('excludes the `new` route', function () {
            return request(app.listen())
              .get('/users/new')
              .expect(200) // NOTE: /users/:id grabs /users/new when `new` is excluded
              .expect({
                user: user1
              })
          })

          it('excludes the `edit` route', function () {
            return request(app.listen())
              .get('/users/1/edit')
              .expect(404)
          })
        })
      })
    })
  })
})
