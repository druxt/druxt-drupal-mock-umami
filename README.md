# Druxt on decoupled-drupal-mock: Umami

A [Druxt](https://druxtjs.org) site running on Drupal's Umami demo content, with no Drupal site, in the look of the [Umami demo](https://umami.demo.druxtjs.org). The backend is [decoupled-drupal-mock](https://github.com/Decipher/decoupled-drupal-mock)'s Umami preset: Drupal 11's JSON:API, Decoupled Router and menu answers, recorded from a real install and served by the mock.

[![The Umami demo's borscht recipe, rendered by Druxt from the mock](.github/poster.png)](https://stackblitz.com/github/druxt/druxt-drupal-mock-umami?file=nuxt.config.js)

[Open in StackBlitz](https://stackblitz.com/github/druxt/druxt-drupal-mock-umami?file=nuxt.config.js). The first start takes a couple of minutes: StackBlitz installs the packages, starts the mock and builds the site in your browser.

## Run it

```sh
npm install
npm run dev
```

`npm run dev` starts the mock on port 3005, waits for it to answer, then starts Nuxt on port 3000. Open http://localhost:3000/recipes/borscht-with-pork-ribs, and switch to Spanish at `/es`.

The browser never talks to the mock directly. Every Drupal request goes through the site's own origin, proxied to the mock in `nuxt.config.js`, so the same setup works in StackBlitz, where the preview can't reach another port.

## What's in it

Start editing in `components/druxt/`. Each file there is a Druxt component, named by its path: `components/druxt/entity/node/recipe/Full.vue` is `DruxtEntityNodeRecipeFull`, which Druxt renders for every recipe in its full display. Change it and every recipe follows.

The site holds its Druxt layer; [`druxt-umami-ui`](https://github.com/druxt/druxt-umami-ui) holds the look.

- `components/druxt/`: the Druxt components. Each takes a Drupal entity, field, block, menu or view from Druxt and renders it with `Umami*` components. Blocks and regions are under `block/` and `block-region/`, entities under `entity/`, fields under `field/`, views under `view/`.
- `components/app/`: the site's own components, named `App*`: the phone menu drawer, and the Druxt marks the promo layer shows.
- `layouts/`: the page, Drupal's block regions in the Umami chrome, and the error page.
- `plugins/i18n.js` and `locales/`: the frontend's own words in English and Spanish, by the path's prefix. Drupal's content, menus and labels arrive translated; these cover the chrome and the notes, passed into the `Umami*` components as props.
- `utils/`: the language helpers (`lang.js`) and the front page test (`front.js`).
- `nuxt.config.js`: Druxt pointed at the mock, with the proxy for JSON:API, the Decoupled Router and Drupal's files, the query settings the components expect, and the component directories.
- `scripts/dev.mjs`: starts the mock and Nuxt together.
- `vendor/druxt-umami-ui-0.1.0-a3015e2.tgz`: [`druxt-umami-ui`](https://github.com/druxt/druxt-umami-ui), the Umami theme and its presentational `Umami*` components, packed from commit `a3015e2` on its `0.x` branch. Its README lists the components with their props and slots. It isn't on npm yet, and StackBlitz can't download a tarball from GitHub, so the packed package ships here. To update it, run `npm pack --ignore-scripts` in a checkout of druxt-umami-ui, replace the file and point `package.json` at it.
- `overlays/language-routing-patches.json.gz`: the preset records Drupal's released modules only. This overlay, from the mock's repository, records the two language-routing patches Druxt relies on, [Decoupled Router #3111456](https://www.drupal.org/i/3111456) and [Druxt #3273228](https://www.drupal.org/i/3273228), so `/es` paths resolve.

The site is read-only. The mock's control routes, for signing in and resetting writes in tests, are left off.

## Versions

This branch, `0.x`, runs Druxt 0.x on Nuxt 2. Nuxt 2's webpack 4 needs Node's legacy OpenSSL provider on Node 17 and later, which `scripts/dev.mjs` sets. A Druxt 2.x version follows the 2.0.0 release.
