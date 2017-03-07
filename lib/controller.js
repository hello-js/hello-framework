'use strict'

/**
 * The Controller class is a parent class intended to be sublcassed for all Hello-based
 * applications.
 *
 * Controllers consist of methods, known as `actions`. These actions will be called on a per-
 * route, or per-socket-method basis.
 *
 * The Controller class provides support for basic REST methods and is designed to work with the
 * Router class.
 *
 * Each Controller instance is initialized during the request cycle and contains the Koa context
 * object (this.ctx) to help maintain state throughout the request lifecycle.
 *
 * Subclasses should define instance methods for each action that will be called via the Router.
 * For example, a RESTful controller subclass would define the standard CRUD methods:
 * 'index()', 'show()', 'create()', 'update()', 'destroy()'.
 *
 * It is not necessary to overwrite the static CRUD methods on this class, they are primarily
 * convenience methods.
 *
 * @example
 * class MyController extends Controller {
 *   index () {
 *     this.ctx.body = `The GET / index() method of the ${this.controllerName} controller`
 *   }
 *
 *   show () {
 *     this.ctx.body = `The GET /${this.ctx.param.id} show() method of the ${this.controllerName} controller`
 *   }
 *
 *   create () {
 *     this.ctx.body = `The POST / create() method of the ${this.controllerName} controller'
 *   }
 *
 *   update () {
 *     this.ctx.body = `The PUT /${this.ctx.param.id} update() method of the ${this.controllerName} controller`
 *   }
 *
 *   destroy () {
 *     this.ctx.body = `The DELETE /${this.ctx.param.id} update() method of the ${this.controllerName} controller`
 *   }
 * }
 */
class Controller {
  /**
   * Builds a new Controller instance
   *
   * @param {Object} ctx - The Koa context object
   * @param {Function} [next] - The next middleware function pointer provided by Koa
   */
  constructor (ctx, next) {
    this.ctx = ctx
    this.next = next
    this.controllerName = this.constructor.name
  }

  /**
   * Helper method to create a new Controller and call the prototype method. All calls via the
   * hello Router class will use this method.
   *
   * @example
   * Controller.forge(ctx, next)
   *
   * @returns {Function} - A koa-capable controller function: fn(ctx, next)
   */
  static action (name) {
    return (ctx, next) => {
      if (!this.prototype[name]) {
        return ctx.throw(501)
      }

      let controller = new this(ctx, next)
      controller.actionName = name

      return controller[name]()
    }
  }

  /**
   * List records
   *
   * To be overwritten by a subclass
   * @abstract
   */
  index () {
    return this.next()
  }

  /**
   * Render the `new` form for creating a new record
   *
   * To be overwritten by a subclass
   * @abstract
   */
  new () {
    return this.next()
  }

  /**
   * Show a specific record
   *
   * To be overwritten by a subclass
   * @abstract
   */
  show () {
    return this.next()
  }

  /**
   * Create a new record
   *
   * To be overwritten by a subclass
   * @abstract
   */
  create () {
    return this.next()
  }

  /**
   * Render the `edit` form for creating a new record
   *
   * To be overwritten by a subclass
   * @abstract
   */
  edit () {
    return this.next()
  }

  /**
   * Update a specific record
   *
   * To be overwritten by a subclass
   * @abstract
   */
  update () {
    return this.next()
  }

  /**
   * Delete a specific record
   *
   * To be overwritten by a subclass
   * @abstract
   */
  destroy () {
    return this.next()
  }
}

module.exports = Controller
