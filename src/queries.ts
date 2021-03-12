import { WithDatabase } from './WithDatabase';

export const queries = (withDatabase: WithDatabase) => {
  /**
   * Returns the first value returned, as given type T
   * Returns null if no values are returned.
   * @param query the SQL query
   * @param values query variables
   */
  const first = async <T>(query: string, values: any[] = []) => {
    const queryResult = await rows<T>(query, values);
    return queryResult.length > 0 ? queryResult[0] : null;
  };

  /**
   * Returns all value returned, as given type T[]
   * @param query the SQL query
   * @param values query variables
   */
  const rows = <T>(query: string, values: any[] = []) =>
    withDatabase<Array<T>>(async (client) => {
      const result = await client.query(query, values);
      return result.rows;
    });
  /**
   * Executes query, but returns no value
   * @param query the SQL query
   * @param values query variables
   */
  const run = (query: string, values: any[] = []) =>
    withDatabase<void>(async (client) => {
      await client.query(query, values);
    });

  return {
    first,
    rows,
    run,
  };
};
