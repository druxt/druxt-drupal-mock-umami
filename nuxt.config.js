// The mock's address inside the sandbox. The browser never sees it: every
// Drupal request goes through this site's own origin, proxied below.
const backend = 'http://127.0.0.1:3005'

// No pages/ directory: druxt-router's catch-all route renders every path, and
// the Umami layout's main content block renders that route, as the Umami demo
// does.
export default {
  target: 'server',
  telemetry: false,
  // druxt-theme-umami is the site's Druxt layer: the wrappers that render
  // Drupal's entities, fields, blocks and views with druxt-ui-mami's Umami*
  // components, the layouts and the words. A component in this site's own
  // components/ replaces the theme's of the same name, as
  // components/druxt/entity/node/recipe/Full.vue does.
  modules: ['druxt-site', 'druxt-theme-umami'],
  druxt: {
    baseUrl: backend,
    proxy: { api: true },
    // The query settings the Umami demo runs with, which its components
    // expect: an entity's fields follow its display (schema), so a teaser
    // gets its image.
    blocks: { query: { fields: [] } },
    entity: { components: { fields: false }, query: { schema: true } },
    menu: { query: { requiredOnly: true } },
    // The blocks and regions DruxtSite renders are the Umami theme's.
    site: { theme: 'umami' },
  },
  proxy: {
    '/en/jsonapi': backend,
    '/es/jsonapi': backend,
    '/router': backend,
    '/en/router': backend,
    '/es/router': backend,
    '/sites/default/files': backend,
  },
}
