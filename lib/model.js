'use strict'

const _ = require('lodash')
const Database = require('./database')
const inflection = require('inflection')

/**
 * Defines the Model class to be extended on a per-model basis
 */
class Model extends Database.Model {
  /**
   * Returns the database instance.
   *
   * @returns {Bookshelf} - a bookshelf instance
   */
  static get database () {
    return Database
  }

  /**
   * Register a model with the Bookshelf registry to prevent circular dependency issues.
   *
   * Most models should be exported with this method.
   *
   * Example:
   *   class User extends Model {
   *     // ...
   *   }
   *
   *   module.exports = Model.register('User', User);
   */
  static register () {
    return Database.model.apply(Database, arguments)
  }

  /**
   * Returns the database table name to be used for the model. The name is inferred based on the
   * model name, underscoring and pluralizing the name.
   *
   * @example
   * class BlogPost extends Model {}
   * let blogPost = new BlogPost();
   * blogPost.tableName
   * // => "blog_posts"
   *
   * @returns {String} The table name
   */
  get tableName () {
    let modelName = this.constructor.name
    let tableized = inflection.tableize(modelName)

    return _.compact([this.schemaName, tableized]).join('.')
  }

  /**
   * Returns the `id` column/attribute on the model
   *
   * @type {string}
   */
  get idAttribute () {
    return 'id'
  }
}

module.exports = Model
