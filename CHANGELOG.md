# 👋 Hello Changelog

## 0.2.13

* Update app template to ensure dotfiles (specifically .gitignore) are created correctly

## 0.2.11

* Ensure process exits cleanly after migrations

## 0.2.10

* Fix how migrations are run via the CLI

## 0.2.9

* Add `Model#update` method to call `save` with `{ patch: true }`
* Add first round of generators (`app`, `controller`, `model`, `migration`)

## 0.2.8

* Use `hello-config` for environment-specific configuration
* Use `hello-index` for auto genated index files

## 0.2.7

* Fix invalid koa dependency

## 0.2.6

* Update max-age configuration for static assets to use milliseconds

## 0.2.5

* Add long-lived caching to static (/public) assets

## 0.2.4

* Merge logic from koa-plus directly into App class
* Require node >= 7

## 0.2.3

* Allow models to access `knex` directly

## 0.2.2

* Require node >= 6

## Initial version (0.1.0, 0.2.0, 0.2.1)

* Add basic internationalization via koa-i18n
* Add static file, favicon serving
* Add basic view rendering with ejs
* Add security headers via koa-helmet
* Connect to the database upon app initialization
* Add Controller class
* Add simple Model class extending Bookshelf
* Add Router class via hello-resource-router
* Add Config class for environment-specific configuration
* Add App class which extends koa-plus
* Add nyc for istanbul coverage
* Add standard.js for linting
