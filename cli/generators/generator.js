'use strict'

const _ = require('lodash')
const fs = require('fs-extra')
const inflection = require('inflection')

class Generator {
  constructor (name, options) {
    this.name = name
    this.safeName = name.replace(/-/g, '_')
    this.options = options || {}
  }

  rawName () {
    return this.name
  }

  controllerName () {
    return `${this.classCase('pluralize')}Controller`
  }

  modelName () {
    return this.classCase('singularize')
  }

  migrationName () {
    if (!this._migrationName) {
      this._migrationName = `${this.yyyymmddhhmmss()}_${this.snakeCase()}`
    }

    return this._migrationName
  }

  classCase (inflectionMethod) {
    if (inflectionMethod === 'pluralize') {
      return inflection.transform(this.safeName, ['pluralize', 'camelize'])
    } else if (inflectionMethod === 'singularize') {
      return inflection.transform(this.safeName, ['singularize', 'classify'])
    }

    return inflection.classify(this.safeName)
  }

  snakeCase (inflectionMethod) {
    return inflection.transform(this.safeName, _.compact([inflectionMethod, 'underscore']))
  }

  camelCase (inflectionMethod) {
    let str = this.safeName

    if (inflectionMethod) {
      str = inflection[inflectionMethod](str)
    }

    return inflection.camelize(str, true)
  }

  kebabCase (inflectionMethod) {
    return inflection.transform(this.safeName, _.compact([inflectionMethod, 'underscore', 'dasherize']))
  }

  async run () {
    throw new Error('Not Implemented')
  }

  async replacePlaceholderInFile (filepath) {
    let stat = await fs.lstat(filepath)

    if (stat.isDirectory()) {
      return
    }

    let contents = await fs.readFile(filepath, 'utf8')
    let replacedContent = this.replacePlaceholderInString(contents)

    await fs.writeFile(filepath, replacedContent)
  }

  replacePlaceholderInString (str) {
    return str
      .replace(/HelloRawTemplate/g, this.rawName())
      .replace(/HelloTemplates/g, this.classCase('pluralize'))
      .replace(/HelloTemplate/g, this.classCase('singularize'))
      .replace(/helloTemplates/g, this.camelCase('pluralize'))
      .replace(/helloTemplate/g, this.camelCase('singularize'))
      .replace(/hello_templates/g, this.snakeCase('pluralize'))
      .replace(/hello_template/g, this.snakeCase('singularize'))
      .replace(/hello-templates/g, this.kebabCase('pluralize'))
      .replace(/hello-template/g, this.kebabCase('singularize'))
  }

  yyyymmddhhmmss () {
    const d = new Date()
    return d.getFullYear().toString() +
      padDate(d.getMonth() + 1) +
      padDate(d.getDate()) +
      padDate(d.getHours()) +
      padDate(d.getMinutes()) +
      padDate(d.getSeconds())
  }
}

function padDate (segment) {
  segment = segment.toString()
  return segment[1] ? segment : `0${segment}`
}

module.exports = Generator
