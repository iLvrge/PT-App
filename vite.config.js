import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

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
    ],
    define: processEnv,
    envPrefix: [ 'REACT_APP_', 'VITE_' ],
    resolve: {
      alias: { '~': '/src' },
    },
    // JSX lives in .js files throughout src/; esbuild must be told to parse
    // them as JSX, both for source and when prebundling dependencies.
    esbuild: { loader: 'jsx', include: /src\/.*\.js$/, exclude: [] },
    optimizeDeps: {
      esbuildOptions: { loader: { '.js': 'jsx' } },
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
