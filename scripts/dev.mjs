import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const options = process.argv.slice(2)
  .filter(argument => argument !== '--strictPort')
  .map(argument => argument === '--host' ? '--hostname' : argument)
const result = spawnSync(process.execPath, [require.resolve('next/dist/bin/next'), 'dev', ...options], { stdio: 'inherit' })
process.exit(result.status ?? 1)
