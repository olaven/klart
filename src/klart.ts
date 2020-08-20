import { Pool, PoolConfig } from 'pg'
import { WithDatabase } from './WithDatabase'
import { queries } from './queries'

const _klart = (config: PoolConfig = {}) => {
    const pool = new Pool(config)

    const withDatabase: WithDatabase = <T>(action: (pool: Pool) => Promise<T>) => action(pool)

    return {
        ...queries(withDatabase),
        end: pool.end
    }
}

export const withConfiguration = (config: PoolConfig) => _klart(config)

export const klart = _klart()
