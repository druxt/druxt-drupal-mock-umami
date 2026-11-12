// The mock's address inside the sandbox. The browser never sees it: every
// Drupal request goes through this site's own origin, proxied below.
const backend = 'http://127.0.0.1:3005'

// No pages/ directory: druxt-router's catch-all route renders every path, and
// the Umami layout's main content block renders that route, as the Umami demo
// does.
export default {
  target: 'server',
  telemetry: false,
  // druxt-umami-ui brings the Umami theme and its Umami* components; this
  // site's own layouts, in layouts/, replace DruxtSite's.
  modules: ['druxt-site', 'druxt-umami-ui'],
  // The Druxt components, as the Umami demo names them:
  // components/druxt/entity/node/recipe/Full.vue is DruxtEntityNodeRecipeFull,
  // which Druxt renders for a recipe in full. components/app/ is flattened:
  // components/app/MobileDrawer.vue is AppMobileDrawer.
  components: [
    { path: '~/components/druxt', prefix: 'Druxt' },
    { path: '~/components/app', prefix: 'App', pathPrefix: false },
  ],
  // The frontend's own words, in English and Spanish, by the path's prefix.
  plugins: ['~/plugins/i18n.js'],
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
