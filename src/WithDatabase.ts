import { Pool } from "pg";

export type WithDatabase = <T>(action: (pool: Pool) => Promise<T>) => Promise<T>