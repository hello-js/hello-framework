'use strict'

const fs = require('fs-extra')
const Generator = require('./generator')
const path = require('path')

class ModelGenerator extends Generator {
  async run () {
    console.log(`  Generating model ${this.modelName()} ...`)

    await this.copyTemplate()
    await this.generateMigration()

    console.log(`  Done. Model located at ./app/models/${this.camelCase('singularize')}.js`)
  }

  async copyTemplate () {
    let destination = path.join('.', 'app', 'models', `${this.camelCase('singularize')}.js`)
    let templateDir = path.join(__dirname, '.', 'templates', 'model')
    let template = path.join(templateDir, 'model.js')

    if (this.options.empty) {
      template = path.join(templateDir, 'empty.js')
    }

    await fs.copy(template, destination)
    return this.replacePlaceholderInFile(destination)
  }

  async generateMigration () {
    let migrationName = this.migrationName(`create_${this.snakeCase('pluralize')}`)
    let destination = path.join('.', 'db', 'migrations', `${migrationName}.js`)
    let templateDir = path.join(__dirname, '.', 'templates', 'model')
    let template = path.join(templateDir, 'migration.js')

    await fs.copy(template, destination)

    return this.replacePlaceholderInFile(destination)
  }
}

module.exports = ModelGenerator
