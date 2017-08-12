'use strict'

const exec = require('child_process').exec
const fs = require('fs-extra')
const path = require('path')
const Generator = require('./generator')
const glob = require('glob-promise')

/**
 * App Generator
 */
class AppGenerator extends Generator {
  async run () {
    console.log(`  Generating app ${this.rawName()} ...`)

    await this.copyAppTemplate()
    await this.replacePlaceholders()
    await this.renameMigration()
    await this.copyDotfiles()
    await this.initializeGit()
    await this.installDependencies()

    console.log(`  App located at ./${this.appPath}`)
    console.log('')
    console.log(`  Now run:`)
    console.log(`    cd ./${this.appPath}`)
    console.log(`    yarn setup`)
  }

  get templatePath () {
    return path.join(__dirname, '.', 'templates', 'app')
  }

  get appPath () {
    return path.join('.', this.rawName())
  }

  copyAppTemplate () {
    return fs.copy(this.templatePath, this.appPath)
  }

  async initializeGit () {
    console.log(`  Inititalizing git ...`)
    await _execPromise('git init', { cwd: this.appPath })
  }

  async installDependencies () {
    console.log(`  Installing dependencies ...`)
    await _execPromise('yarn add hello pg', { cwd: this.appPath })
    await _execPromise('yarn add standard --dev', { cwd: this.appPath })
  }

  copyDotfiles () {
    let oldName = path.join(this.appPath, 'gitignore')
    let newName = path.join(this.appPath, '.gitignore')

    return fs.rename(oldName, newName)
  }

  async replacePlaceholders () {
    let files = await glob(path.join(this.appPath, '**', '*'))

    await Promise.all(files.map(async (file) => {
      await this.replacePlaceholderInFile(file)
    }))
  }

  renameMigration () {
    let migration = path.join(this.appPath, 'db', 'migrations', '0_setup_database.js')
    let newName = path.join(this.appPath, 'db', 'migrations', `${this.yyyymmddhhmmss()}_setup_database.js`)

    return fs.rename(migration, newName)
  }
}

function _execPromise(cmd, opts = {}) {
  return new Promise((resolve, reject) => {
    exec(cmd, opts, function (err) {
      if (err) {
        return reject(err)
      }

      return resolve()
    })
  })
}

module.exports = AppGenerator
