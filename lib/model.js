'use strict'

const _ = require('lodash')
const objection = require('objection')
const objectionVisibility = require('objection-visibility')
const Model = objection.Model
const inflection = require('inflection')

/**
 * Plugin definitions
 */
objectionVisibility(Model)

/**
 * Defines the Model class to be extended on a per-model basis
 */
class HelloModel extends Model {
  /**
   * Returns the database table name to be used for the model. The name is inferred based on the
   * model name, underscoring and pluralizing the name.
   *
   * @example
   * class BlogPost extends Model {}
   * BlogPost.tableName
   * // => "blog_posts"
   *
   * @returns {String} The table name
   */
  static get tableName () {
    let modelName = this.name
    let tableized = inflection.tableize(modelName)

    return _.compact([this.schemaName, tableized]).join('.')
  }

  /**
   * Before-insert hook. This will set the created_at and updated_at
   * fields if timestamps are enabled on this model.
   */
  $beforeInsert () {
    super.$beforeInsert()

    if (this.constructor.hasTimestamps) {
      this.created_at = new Date().toISOString()
      this.updated_at = new Date().toISOString()
    }
  }

  /**
   * Before-update hook. This will set the updated_at field if timestamps
   * are enabled on this model.
   */
  $beforeUpdate () {
    super.$beforeUpdate()

    if (this.constructor.hasTimestamps) {
      this.updated_at = new Date().toISOString()
    }
  }
}

module.exports = HelloModel
