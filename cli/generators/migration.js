'use strict'

const fs = require('fs-extra')
const Generator = require('./generator')
const path = require('path')

class MigrationGenerator extends Generator {
  async run () {
    console.log(`Generating migration ${this.snakeCase()} ...`)

    await this.copyTemplate()

    console.log(`Done. Migration located at ./db/migratons/${this.migrationName()}.js`)
  }

  async copyTemplate () {
    let destination = path.join('.', 'db', 'migrations', `${this.migrationName()}.js`)
    let templateDir = path.join(__dirname, '.', 'templates', 'migration')
    let template = path.join(templateDir, 'empty.js')

    await fs.copy(template, destination)

    return this.replacePlaceholderInFile(destination)
  }
}

module.exports = MigrationGenerator
