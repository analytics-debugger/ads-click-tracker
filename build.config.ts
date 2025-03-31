import terser from '@rollup/plugin-terser'
import { rollup } from 'rollup'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['./src/index'],
  outDir: 'dist',
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
    esbuild: {
      target: 'esnext',
      minify: false, // Ensure unminified ESM & CJS are built first
    },
  },
  hooks: {
    'build:done': async () => {
      const bundle = await rollup({
        input: 'dist/index.mjs',
      })

      const outputs = [
        // ESM (Minified)
        { file: 'dist/index.min.mjs', format: 'es', plugins: [terser()] },

        // CJS (Minified)
        { file: 'dist/index.min.cjs', format: 'cjs', plugins: [terser()] },

        // IIFE (Unminified)
        { file: 'dist/AdsClickTracker.iife.js', format: 'iife', name: 'AdsClickTracker' },

        // IIFE (Minified)
        { file: 'dist/AdsClickTracker.iife.min.js', format: 'iife', name: 'AdsClickTracker', plugins: [terser()] },

        // UMD (Unminified)
        { file: 'dist/AdsClickTracker.umd.js', format: 'umd', name: 'AdsClickTracker' },

        // UMD (Minified)
        { file: 'dist/AdsClickTracker.umd.min.js', format: 'umd', name: 'AdsClickTracker', plugins: [terser()] },
      ]

      for (const output of outputs) {
        await bundle.write(output)
      }

      await bundle.close()
    },
  },
})
