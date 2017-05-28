'use strict'

const fs = require('fs-extra')
const Generator = require('./generator')
const path = require('path')

class ModelGenerator extends Generator {
  async run () {
    console.log(`Generating model ${this.modelName()} ...`)

    await this.copyTemplate()
    // await this.generateMigration()

    console.log(`Done. Model located at ./app/models/${this.camelCase()}.js`)
  }

  async copyTemplate () {
    let destination = path.join('.', 'app', 'models', `${this.camelCase()}.js`)
    let templateDir = path.join(__dirname, '.', 'templates', 'model')
    let template = path.join(templateDir, 'model.js')

    if (this.options.empty) {
      template = path.join(templateDir, 'empty.js')
    }

    await fs.copy(template, destination)
    return this.replacePlaceholderInFile(destination)
  }
}

module.exports = ModelGenerator
