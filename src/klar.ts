import { Pool, PoolConfig } from 'pg'
import { WithDatabase } from './WithDatabase'
import { queries } from './queries'

export const klar = (config: PoolConfig = {}) => {
    const pool = new Pool(config)

    const withDatabase: WithDatabase = <T>(action: (pool: Pool) => Promise<T>) => action(pool)

    return {
        ...queries(withDatabase),
        end: pool.end
    }
}
