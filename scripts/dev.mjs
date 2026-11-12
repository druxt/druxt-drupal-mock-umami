// Starts the mock's Umami preset, waits for it to answer, then starts the Nuxt
// dev server: Druxt reads Drupal's schemas as it starts. Stops both when
// either exits.
import { spawn } from 'node:child_process'

const MOCK = 'http://127.0.0.1:3005'

const run = (command, args, env = {}) =>
  spawn(command, args, { stdio: 'inherit', env: { ...process.env, ...env } })

const children = []
const stop = (code) => {
  for (const child of children) child.kill()
  process.exit(code ?? 0)
}

const ready = async () => {
  for (let attempt = 0; attempt < 120; attempt++) {
    try {
      if ((await fetch(`${MOCK}/jsonapi`)).ok) return
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  throw new Error(`The mock did not answer at ${MOCK}/jsonapi.`)
}

// The stock preset records released modules only. This overlay records the
// two language-routing patches Druxt needs, so /es paths resolve.
children.push(
  run('npx', [
    'decoupled-drupal-mock', 'serve', 'umami', '--port', '3005', '--host', '127.0.0.1',
    '--overlay', './overlays/language-routing-patches.json.gz',
  ])
)
await ready()
// Nuxt 2's webpack 4 needs the legacy OpenSSL provider on Node 17 and later.
const nuxtArgs = process.argv.slice(2).length ? process.argv.slice(2) : ['dev', '--port', '3000']
children.push(
  run('npx', ['nuxt', ...nuxtArgs], {
    NODE_OPTIONS: [process.env.NODE_OPTIONS, '--openssl-legacy-provider'].filter(Boolean).join(' '),
  })
)
for (const child of children) child.on('exit', stop)
