# druxt-theme-umami

The [Umami demo](https://umami.demo.druxtjs.org) as a Druxt theme for a Nuxt 2
site: the wrapper components that render Drupal's Umami content, the layouts,
and the frontend's words in English and Spanish.

A Druxt theme is a package of wrapper components that a site installs, and
can still override one file at a time. That's the design in
[druxt/druxt.js#121](https://github.com/druxt/druxt.js/issues/121): Druxt
looks for a wrapper in the site first, then in the theme, then falls back to
its own defaults. This package is a working example of it on Druxt 0.x.

It's version 0.1.0 and unreleased, so it lives in the demo site's repository
for now. The Druxt 2.x version will be `@druxt/theme-umami`.

## What it provides

- `components/druxt/`: the wrappers. Each takes a Drupal entity, field, block,
  menu or view from Druxt and renders it with the `Umami*` components. Each
  is named by its path, as Druxt looks for it:
  `components/druxt/entity/node/recipe/Full.vue` is
  `DruxtEntityNodeRecipeFull`. Blocks and regions are under `block/` and
  `block-region/`, entities under `entity/`, fields under `field/`, views
  under `view/`.
- `components/app/`: the theme's own components, flattened and named `App*`:
  `components/app/MobileDrawer.vue` is `AppMobileDrawer`.
- `layouts/`: the page, Drupal's block regions in the Umami chrome, and the
  error page.
- `plugins/i18n.js` and `locales/`: the frontend's own words, by the path's
  language prefix. Drupal's content, menus and labels arrive translated;
  these cover the chrome and the notes.
- `utils/`: the language helpers (`lang.js`) and the front page test
  (`front.js`), which a site's own components can import, as
  `druxt-theme-umami/utils/lang`.
- [`druxt-ui-mami`](https://github.com/druxt/druxt-ui-mami), added by this
  module: the Umami styles on Bootstrap 4, the fonts, and the presentational
  `Umami*` components the wrappers render.

## Install it

Add the package, and add it after `druxt-site` in `nuxt.config.js`. It adds
`druxt-ui-mami` itself, so the site lists only the theme:

```js
// nuxt.config.js
export default {
  modules: ['druxt-site', 'druxt-theme-umami'],
  druxt: {
    baseUrl: 'https://umami.example.com',
    // The query settings the wrappers expect: an entity's fields follow its
    // display, so a teaser gets its image.
    blocks: { query: { fields: [] } },
    entity: { components: { fields: false }, query: { schema: true } },
    menu: { query: { requiredOnly: true } },
    site: { theme: 'umami' },
  },
}
```

The site needs no `components`, `layouts`, `plugins` or `locales` of its own.

## Override a wrapper

Copy a wrapper into the site's own `components/` at the same path, and edit
the copy. Same path, same name, and the site's file wins. Delete it and the
theme's renders again.

To change the recipe page, copy
`components/druxt/entity/node/recipe/Full.vue` into the site, as
`components/druxt/entity/node/recipe/Full.vue`, and change what it renders.
Here the note under the recipe gets a heading of the site's own:

```vue
<!-- components/druxt/entity/node/recipe/Full.vue, in the site -->
<template>
  <UmamiRecipePage>
    <!-- ... the theme's markup, as copied ... -->
    <UmamiNote
      class="mt-5"
      title="Cooked by our own recipe component"
      :cta="$t('note.recipeCta')"
      href="https://druxtjs.org/modules/entity"
      :code="code"
      >{{ $t('note.recipeBody', { mode: 'full' }) }}</UmamiNote
    >
  </UmamiRecipePage>
</template>

<script>
import { DruxtEntityMixin } from 'druxt-entity'
import { langMixin } from 'druxt-theme-umami/utils/lang'

export default {
  mixins: [langMixin, DruxtEntityMixin],
  // ... the theme's computed and druxt settings, as copied ...
}
</script>
```

Change the copy's imports from relative paths to the package's, as above.

A layout works the same way: a site's `layouts/default.vue` or
`layouts/error.vue` replaces the theme's.

## How it works

`module.js` is a Nuxt 2 module. It registers the theme's directories with
[`@nuxt/components`](https://github.com/nuxt/components#level) at `level: 1`.
For two components of the same name, `@nuxt/components` keeps the one with
the lowest level, and a site's own `~/components` is level 0, so the site's
wins. A base theme, a theme this one built on, would register at level 2.

Some wrappers extend another, such as the recipe's default display, which
renders as its full one. They import it by name, from
`#wrappers/DruxtEntityNodeRecipeFull`, rather than by file, so they extend
the site's override when there is one. `#wrappers/<Name>` is the component
`@nuxt/components` resolved for that name, regenerated in the build
directory as component files come and go.

The theme's layouts are added only where the site has none of the same
name, and its i18n plugin runs after Druxt's own.
