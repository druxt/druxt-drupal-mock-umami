# Druxt on decoupled-drupal-mock: Umami

A [Druxt](https://druxtjs.org) site running on Drupal's Umami demo content, with no Drupal site, in the look of the [Umami demo](https://umami.demo.druxtjs.org). The backend is [decoupled-drupal-mock](https://github.com/Decipher/decoupled-drupal-mock)'s Umami preset: Drupal 11's JSON:API, Decoupled Router and menu answers, recorded from a real install and served by the mock.

[![The Umami demo's borscht recipe, rendered by Druxt from the mock](.github/poster.png)](https://stackblitz.com/github/druxt/druxt-drupal-mock-umami?file=components/druxt/entity/node/recipe/Full.vue)

[Open in StackBlitz](https://stackblitz.com/github/druxt/druxt-drupal-mock-umami?file=components/druxt/entity/node/recipe/Full.vue). The first start takes a couple of minutes: StackBlitz installs the packages, starts the mock and builds the site in your browser. It opens on the recipe page's component, `components/druxt/entity/node/recipe/Full.vue`: change it and every recipe follows.

## Run it

```sh
npm install
npm run dev
```

`npm run dev` starts the mock on port 3005, waits for it to answer, then starts Nuxt on port 3000. Open http://localhost:3000/recipes/borscht-with-pork-ribs, and switch to Spanish at `/es`.

The browser never talks to the mock directly. Every Drupal request goes through the site's own origin, proxied to the mock in `nuxt.config.js`, so the same setup works in StackBlitz, where the preview can't reach another port.

## What's in it

The site is three layers, each built on the one before:

1. [`druxt-ui-mami`](https://github.com/druxt/druxt-ui-mami): the look. The Umami styles on Bootstrap 4, and the presentational `Umami*` components, which take props and slots and know nothing of Drupal.
2. [`druxt-theme-umami`](theme-umami), in `theme-umami/`: the Druxt theme. Its wrapper components take each Drupal entity, field, block, menu and view from Druxt and render it with the `Umami*` components; it also holds the layouts, the `App*` components and the frontend's words in English and Spanish. It adds `druxt-ui-mami` itself. Themes are the design in [druxt/druxt.js#121](https://github.com/druxt/druxt.js/issues/121); [its README](theme-umami/README.md) covers what it provides and how to override it.
3. The site: `nuxt.config.js`, and one component of its own, `components/druxt/entity/node/recipe/Full.vue`.

Start editing in `components/druxt/entity/node/recipe/Full.vue`. Druxt names each wrapper by its path, so that file is `DruxtEntityNodeRecipeFull`, the recipe page. The theme has a file of the same name, and the site's wins: change it and every recipe follows, delete it and the theme's renders again. To change any other part, copy the theme's file from `theme-umami/components/` to the same path under `components/`, and edit the copy.

- `nuxt.config.js`: Druxt pointed at the mock, with the proxy for JSON:API, the Decoupled Router and Drupal's files, the query settings the theme's components expect, and the theme.
- `components/druxt/entity/node/recipe/Full.vue`: the site's override of the theme's recipe page.
- `theme-umami/`: the theme, installed as an npm workspace, so its files are plain files in this repository and in StackBlitz's editor.
- `scripts/dev.mjs`: starts the mock and Nuxt together.
- `vendor/druxt-ui-mami-0.1.0-62331ca.tgz`: [`druxt-ui-mami`](https://github.com/druxt/druxt-ui-mami), packed from commit `62331ca` on its `0.x` branch. Its README lists the components with their props and slots. It isn't on npm yet, and StackBlitz can't download a tarball from GitHub, so the packed package ships here, and the theme depends on it. To update it, run `npm pack --ignore-scripts` in a checkout of druxt-ui-mami, replace the file and point `theme-umami/package.json` at it.
- `overlays/language-routing-patches.json.gz`: the preset records Drupal's released modules only. This overlay, from the mock's repository, records the two language-routing patches Druxt relies on, [Decoupled Router #3111456](https://www.drupal.org/i/3111456) and [Druxt #3273228](https://www.drupal.org/i/3273228), so `/es` paths resolve.

The site is read-only. The mock's control routes, for signing in and resetting writes in tests, are left off.

## Versions

This branch, `0.x`, runs Druxt 0.x on Nuxt 2. Nuxt 2's webpack 4 needs Node's legacy OpenSSL provider on Node 17 and later, which `scripts/dev.mjs` sets. A Druxt 2.x version follows the 2.0.0 release.
