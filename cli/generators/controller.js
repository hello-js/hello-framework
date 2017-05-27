'use strict'

const fs = require('fs-extra')
const Generator = require('./generator')
const path = require('path')

class ControllerGenerator extends Generator {
  async run () {
    console.log(`Generating controller ${this.controllerName()} ...`)

    await this.copyTemplate()

    console.log(`Done. Controller located at ./app/controllers/${this.camelCase(true)}.js`)
  }

  copyTemplate () {
    let destination = path.join('.', 'app', 'controllers', `${this.camelCase(true)}.js`)
    let templateDir = path.join(__dirname, '.', 'templates', 'controller')
    let template = path.join(templateDir, 'controller.js')

    if (this.options.empty) {
      template = path.join(templateDir, 'empty.js')
    }

    return fs.copy(template, destination)
  }
}

module.exports = ControllerGenerator
