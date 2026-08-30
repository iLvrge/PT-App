import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import tailwindcss from '@tailwindcss/vite'
import { writeFileSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Emits src/styles/theme.generated.css from src/themes/tokens.js so MUI and
// Tailwind read the same palette and cannot drift apart.
function themeTokens() {
  const write = () => {
    const src = readFileSync(resolve('src/themes/tokens.js'), 'utf8')
    const body = src.slice(src.indexOf('const tokens ='), src.lastIndexOf('export default'))
    // eslint-disable-next-line no-new-func
    const tokens = new Function(`${body}; return tokens`)()
    const block = (sel, vals) =>
      `${sel} {\n${Object.entries(vals).map(([k, v]) => `  --pt-${k}: ${v};`).join('\n')}\n}`
    writeFileSync(
      resolve('src/styles/theme.generated.css'),
      `/* GENERATED from src/themes/tokens.js - do not edit. */\n${block(':root', tokens.light)}\n${block('.dark', tokens.dark)}\n`
    )
  }
  return {
    name: 'pt-theme-tokens',
    buildStart: write,
    configureServer(server) {
      write()
      server.watcher.add(resolve('src/themes/tokens.js'))
      server.watcher.on('change', (f) => { if (f.endsWith('tokens.js')) write() })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // The app reads config through `process.env.REACT_APP_*` in 240 places.
  // Mapping them here keeps the existing .env file and every call site working
  // rather than rewriting them all to import.meta.env.
  const processEnv = Object.keys(env)
    .filter((key) => key.startsWith('REACT_APP_') || key === 'REACT_MEETING_URL')
    .reduce(
      (acc, key) => ({ ...acc, [`process.env.${key}`]: JSON.stringify(env[key]) }),
      {
        'process.env.NODE_ENV': JSON.stringify(mode === 'development' ? 'development' : 'production'),
        'process.env.PUBLIC_URL': JSON.stringify(''),
      }
    )

  return {
    plugins: [
      // JSX lives in .js files throughout src/, not .jsx.
      react({ include: /\.(js|jsx)$/ }),
      svgr(),
      tailwindcss(),
      themeTokens(),
    ],
    define: processEnv,
    envPrefix: [ 'REACT_APP_', 'VITE_' ],
    resolve: {
      alias: {
        '~': '/src',
        // React 17 ships jsx-runtime.js but has no package exports map, so a
        // bare 'react/jsx-runtime' - which Radix's ESM builds import - cannot be
        // resolved by Node. Vite's browser resolver copes; Vitest's does not.
        'react/jsx-runtime': 'react/jsx-runtime.js',
        'react/jsx-dev-runtime': 'react/jsx-dev-runtime.js',
      },
    },
    // JSX lives in .js files throughout src/; esbuild must be told to parse
    // them as JSX, both for source and when prebundling dependencies.
    esbuild: { loader: 'jsx', include: /src\/.*\.jsx?$/, exclude: [] },
    optimizeDeps: {
      esbuildOptions: { loader: { '.js': 'jsx' } },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: [ './src/test/setup.js' ],
      include: [ 'src/**/*.{test,spec}.{js,jsx}' ],
      css: false,
      server: {
        deps: {
          // These packages' ESM imports a bare 'react/jsx-runtime'. React 17
          // has no package exports map, so Node cannot resolve it; processing
          // them through Vite instead lets the alias above apply. Vite's own
          // browser resolver copes, which is why the production build is fine.
          inline: [ /@radix-ui/, /@tanstack/ ],
        },
      },
    },
    server: { port: 3000, open: false },
    preview: { port: 3000 },
    build: {
      outDir: 'build',
      sourcemap: false,
      chunkSizeWarningLimit: 900,
    },
  }
})
