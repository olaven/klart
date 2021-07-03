import pg from 'pg';
import { WithDatabase } from './WithDatabase';
import { queries } from './queries';

const _klart = (config: pg.PoolConfig = {}) => {
  const withDatabase: WithDatabase = <T>(action: (pool: pg.Pool) => Promise<T>) => {
    const pool = new pg.Pool(config);
    const result = action(pool);
    pool.end();
    return result;
  };

  return {
    ...queries(withDatabase),
  };
};

const klart = _klart();
export const withConfiguration = (config: pg.PoolConfig) => _klart(config);
export const first = klart.first;
export const rows = klart.rows;
export const run = klart.run;
