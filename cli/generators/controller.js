'use strict'

const _ = require('lodash')
const fs = require('fs-extra')
const Generator = require('./generator')
const path = require('path')

class ControllerGenerator extends Generator {
  async run () {
    console.log(`Generating controller ${this.controllerName()} ...`)

    await this.copyTemplate()
    await this.updateRoutes()

    console.log(`Done. Controller located at ./app/controllers/${this.camelCase('pluralize')}.js`)
  }

  async copyTemplate () {
    let destination = path.join('.', 'app', 'controllers', `${this.camelCase('pluralize')}.js`)
    let templateDir = path.join(__dirname, '.', 'templates', 'controller')
    let template = path.join(templateDir, 'controller.js')

    if (this.options.empty) {
      template = path.join(templateDir, 'empty.js')
    }

    await fs.copy(template, destination)
    return this.replacePlaceholderInFile(destination)
  }

  async updateRoutes () {
    if (this.options.empty) {
      return
    }

    let route = this.replacePlaceholderInString('router.resources(\'hello-templates\', controllers.helloTemplates)\n')
    let routesFile = path.join('.', 'app', 'routes.js')

    let routesContent = await fs.readFile(routesFile, 'utf8')
    let routesSplit = routesContent.split('\n')

    let index = _.findLastIndex(routesSplit, (row) => row.startsWith('module.exports ='))

    routesSplit.splice(index, 0, route)

    return fs.writeFile(routesFile, routesSplit.join('\n'))
  }
}

module.exports = ControllerGenerator
