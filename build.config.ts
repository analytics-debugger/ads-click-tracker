import fs from 'node:fs'
import path from 'node:path'
import { defineBuildConfig } from 'unbuild'

function commonHook(options, minified = false) {
  // Ensure dist directory exists
  const distPath = path.resolve(options.outDir)
  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true })
  }

  // Determine new filename based on build configuration
  let newFilename
  if (options.rollup?.output?.format === 'esm') {
    newFilename = minified ? 'index.esm.min.mjs' : 'index.esm.mjs'
  }
  else if (options.rollup?.output?.format === 'iife') {
    newFilename = minified ? 'index.iife.min.js' : 'index.iife.js'
  }
  else if (options.rollup?.output?.format === 'umd') {
    newFilename = minified ? 'index.umd.min.js' : 'index.umd.js'
  }
  else {
    newFilename = 'index.mjs'
  }

  // Rename file
  const oldPath = path.resolve(options.outDir, 'index.mjs')
  const newPath = path.resolve(options.outDir, newFilename)

  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath)
  }
}

export default defineBuildConfig([
  // ESM Minified
  {
    entries: ['src/index'],
    rollup: {
      esbuild: { minify: true },
      output: {
        format: 'esm',
      },
    },
    declaration: 'node16',
    clean: true,
    hooks: {
      'build:done': ({ options }) => {
        commonHook(options, true)
      },
    },
  },
  // ESM Unminified
  {
    entries: ['src/index'],
    rollup: {
      esbuild: { minify: false },
      output: {
        format: 'esm',
      },
    },
    declaration: 'node16',
    clean: true,
    hooks: {
      'build:done': ({ options }) => {
        commonHook(options, false)
      },
    },
  },
  // Previous configurations (IIFE, UMD, etc.)
  {
    entries: ['src/index'],
    clean: true,
    rollup: {
      esbuild: { minify: true },
      output: {
        name: 'AdsClickTracker',
        format: 'iife',
        dir: 'dist',
      },
    },
    hooks: {
      'build:done': ({ options }) => {
        commonHook(options, true)
      },
    },
  },
  {
    entries: ['src/index'],
    clean: true,
    rollup: {
      esbuild: { minify: false },
      output: {
        name: 'AdsClickTracker',
        format: 'iife',
        dir: 'dist',
      },
    },
    hooks: {
      'build:done': ({ options }) => {
        commonHook(options, false)
      },
    },
  },
  {
    entries: ['src/index'],
    rollup: {
      esbuild: { minify: true },
      output: {
        name: 'AdsClickTracker',
        format: 'umd',
      },
    },
    declaration: 'node16',
    clean: true,
    hooks: {
      'build:done': ({ options }) => {
        commonHook(options, true)
      },
    },
  },
  {
    entries: ['src/index'],
    rollup: {
      esbuild: { minify: false },
      output: {
        name: 'AdsClickTracker',
        format: 'umd',
      },
    },
    declaration: 'node16',
    clean: true,
    hooks: {
      'build:done': ({ options }) => {
        commonHook(options, false)
      },
    },
  },
])
