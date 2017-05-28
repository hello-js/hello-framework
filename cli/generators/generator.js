'use strict'

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
    return `${this.classCase(true)}Controller`
  }

  modelName () {
    return this.classCase()
  }

  classCase (pluralize = false) {
    if (pluralize) {
      return inflection.transform(this.safeName, ['pluralize', 'camelize'])
    }

    return inflection.transform(this.safeName, ['singularize', 'classify'])
  }

  snakeCase (pluralize = false) {
    let method = pluralize ? 'pluralize' : 'singularize'

    return inflection.transform(this.safeName, [method, 'underscore'])
  }

  camelCase (pluralize = false) {
    let method = pluralize ? 'pluralize' : 'singularize'

    return inflection.camelize(inflection[method](this.safeName), true)
  }

  kebabCase (pluralize = false) {
    let method = pluralize ? 'pluralize' : 'singularize'
    return inflection.transform(this.safeName, [method, 'underscore', 'dasherize'])
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
      .replace(/HelloTemplates/g, this.classCase(true))
      .replace(/HelloTemplate/g, this.classCase())
      .replace(/helloTemplates/g, this.camelCase(true))
      .replace(/helloTemplate/g, this.camelCase())
      .replace(/hello_templates/g, this.snakeCase(true))
      .replace(/hello_template/g, this.snakeCase())
      .replace(/hello-templates/g, this.kebabCase(true))
      .replace(/hello-template/g, this.kebabCase())
  }
}

module.exports = Generator
