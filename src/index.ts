import pg from 'pg';
import { WithDatabase } from './WithDatabase';
import { queries } from './queries';

const _klart = (config: pg.PoolConfig = {}) => {
  const pool = new pg.Pool(config);

  const withDatabase: WithDatabase = <T>(action: (pool: pg.Pool) => Promise<T>) => action(pool);

  return {
    ...queries(withDatabase),
    end: pool.end as (callback?: () => void) => void,
  };
};

const klart = _klart();
export const withConfiguration = (config: pg.PoolConfig) => _klart(config);
export const first = klart.first;
export const rows = klart.rows;
export const end = klart.end;
export const run = klart.run;