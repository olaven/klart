import { Pool, PoolConfig } from 'pg'
import { WithDatabase } from './WithDatabase'
import { queries } from './queries'

export const klar = (config: PoolConfig = {}) => {
  const pool = new Pool(config)

  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

  const withDatabase: WithDatabase = <T>(action: (pool: Pool) => Promise<T>) => action(pool)

  return {
    ...queries(withDatabase),
    end: pool.end
  }
}
