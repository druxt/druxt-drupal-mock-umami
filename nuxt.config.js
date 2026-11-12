// The mock's address inside the sandbox. The browser never sees it: every
// Drupal request goes through this site's own origin, proxied below.
const backend = 'http://127.0.0.1:3005'

export default {
  target: 'server',
  telemetry: false,
  modules: ['druxt-site'],
  druxt: {
    baseUrl: backend,
    proxy: { api: true },
    entity: { components: { fields: false } },
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
