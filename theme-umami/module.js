const fs = require('fs')
const path = require('path')

const r = (...parts) => path.resolve(__dirname, ...parts)

/**
 * DruxtThemeUmami: the Umami demo as a Druxt theme for a Nuxt 2 site.
 *
 * Adds druxt-ui-mami, for the look and the `Umami*` components, then this
 * theme's Druxt wrappers, its `App*` components, its layouts and its words.
 *
 * Everything the theme adds gives way to the site:
 * - Its components are registered at level 1. @nuxt/components keeps the
 *   lowest level for a name, and the site's own `~/components` is level 0,
 *   so a site file with the same name, such as
 *   `components/druxt/entity/node/recipe/Full.vue`, wins.
 * - Its layouts are added only where the site has no layout of that name.
 *
 * Add it after `druxt-site` in `modules`.
 */
module.exports = function DruxtThemeUmamiModule() {
  const { options } = this

  this.addModule('druxt-ui-mami')

  // The theme's files are Vue and ES modules. Transpiled by package name,
  // for imports such as `druxt-theme-umami/utils/lang`, and by path, for
  // an install that links to a folder outside node_modules.
  options.build.transpile.push('druxt-theme-umami', __dirname)

  // The wrappers, named as Druxt looks for them, by path:
  // components/druxt/entity/node/recipe/Full.vue is DruxtEntityNodeRecipeFull.
  // components/app/ is flattened: components/app/MobileDrawer.vue is
  // AppMobileDrawer. The site's `~/components`, at level 0, gives the same
  // names to the same paths.
  options.components = options.components ?? true
  this.nuxt.hook('components:dirs', (dirs) => {
    dirs.push(
      { path: r('components/druxt'), prefix: 'Druxt', level: 1 },
      { path: r('components/app'), prefix: 'App', pathPrefix: false, level: 1 }
    )
  })

  // `#wrappers/<Name>` is the component @nuxt/components resolved for that
  // name, the site's or the theme's, so a theme wrapper that extends another
  // extends the site's override where there is one. One module per name,
  // under the build directory, rewritten whenever a component file is added
  // or removed.
  const wrappersDir = path.join(options.buildDir, 'druxt-theme-umami')
  const resolved = {}
  let templated = false
  this.nuxt.hook('components:extend', (components) => {
    for (const { pascalName, filePath } of components) {
      resolved[pascalName] = filePath
    }
    if (templated) return
    templated = true
    for (const name of Object.keys(resolved)) {
      this.addTemplate({
        src: r('templates/wrapper.js'),
        fileName: `druxt-theme-umami/${name}.js`,
        options: { name, source: () => path.relative(wrappersDir, resolved[name]) },
      })
    }
  })
  this.extendBuild((config) => {
    config.resolve.alias['#wrappers'] = wrappersDir
  })

  // The layouts, unless the site has its own of the same name.
  const siteLayouts = path.resolve(options.srcDir, options.dir.layouts)
  const siteHas = (name) =>
    ['vue', 'js', 'ts'].some((ext) => fs.existsSync(path.join(siteLayouts, `${name}.${ext}`)))
  if (!siteHas('default')) {
    options.layouts.default = r('layouts/default.vue')
  }
  if (!siteHas('error')) {
    options.ErrorPage = r('layouts/error.vue')
  }

  // The frontend's own words, in English and Spanish.
  options.plugins.push(r('plugins/i18n.js'))
}

module.exports.meta = require('./package.json')
