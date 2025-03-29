// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: [
      'pnpm-workspace.yaml',
      'README.md',
    ],
    type: 'lib',
    pnpm: true,
  },
)
